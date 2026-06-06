"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { logout } from "@/lib/auth-actions";
import { getValueAtPath } from "@/lib/builder/paths";
import type { Site } from "@/lib/schema";

type PageRef = { slug: string; label: string };
type Kind = "text" | "media" | "cta" | "unknown";

function classify(value: unknown): Kind {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "string" || typeof value === "number") return "text";
  if (typeof value === "object") {
    if ("alt" in value) return "media";
    if ("label" in value && "href" in value) return "cta";
  }
  return "unknown";
}

const shortValue = (v: unknown) => {
  const s = typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  return s.length > 60 ? s.slice(0, 59) + "…" : s;
};

/**
 * Chat-first builder. The Assistant is the default way to edit: click an element
 * (optional) and tell the assistant what to change — it calls validated
 * mutations. Manual editing is a tucked-away override; SEO is automatic unless
 * "Advanced SEO" is on. Every change persists, then the preview refreshes.
 */
export function EditorShell({
  site,
  pageSlug,
  pages,
  children,
}: {
  site: Site;
  pageSlug: string;
  pages: PageRef[];
  children: ReactNode;
}) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const page = site.pages.find((p) => p.slug === pageSlug);
  const sections = page?.sections ?? [];

  let selectedValue: unknown;
  try {
    selectedValue = selectedPath ? getValueAtPath(site, selectedPath) : undefined;
  } catch {
    selectedValue = undefined;
  }
  const kind = classify(selectedValue);

  // Click-to-select inside the preview; block navigation.
  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a") || target.closest("button")) e.preventDefault();
      const el = target.closest<HTMLElement>("[data-edit]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const path = el.getAttribute("data-edit");
      if (path) {
        setSelectedPath(path);
        setManualOpen(false);
        setMessage(null);
      }
    };
    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  async function call(url: string, payload: Record<string, unknown>): Promise<boolean> {
    setSending(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error ?? "Something went wrong.", error: true });
        return false;
      }
      setMessage({ text: data.summary ?? "Saved." });
      router.refresh();
      return true;
    } catch (err) {
      setMessage({ text: (err as Error).message ?? "Network error.", error: true });
      return false;
    } finally {
      setSending(false);
    }
  }

  async function uploadToBlob(file: File) {
    const kind: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type,
    });
    const dims = kind === "image" ? await imageDims(file).catch(() => ({})) : {};
    return { url: blob.url, kind, ...dims } as {
      url: string;
      kind: "image" | "video";
      width?: number;
      height?: number;
    };
  }

  async function sendToAssistant() {
    if (!instruction.trim() && !attachedFile) return;

    if (attachedFile) {
      setUploading(true);
      setMessage(null);
      try {
        const m = await uploadToBlob(attachedFile);
        const dims = m.width ? { width: m.width, height: m.height } : {};
        let ok: boolean;
        if (selectedPath && kind === "media") {
          // A media slot is selected → replace it directly.
          ok = await call("/api/edit", {
            op: "media",
            path: selectedPath,
            src: m.url,
            kind: m.kind,
            ...dims,
          });
        } else {
          // Let the assistant place it on the section the message names.
          ok = await call("/api/agent", {
            message: instruction || "Place this image where I described.",
            pageSlug,
            selectedPath,
            advanced,
            attachment: { url: m.url, kind: m.kind },
          });
        }
        if (ok) {
          setInstruction("");
          setAttachedFile(null);
        }
      } catch (err) {
        setMessage({ text: (err as Error).message ?? "Upload failed.", error: true });
      } finally {
        setUploading(false);
      }
      return;
    }

    const ok = await call("/api/agent", { message: instruction, pageSlug, selectedPath, advanced });
    if (ok) setInstruction("");
  }

  function setField(path: string, value: string) {
    return call("/api/edit", { op: "set", path, value, advanced });
  }

  async function handleUpload(file: File) {
    if (!selectedPath) return;
    setUploading(true);
    setMessage(null);
    try {
      const m = await uploadToBlob(file);
      const dims = m.width ? { width: m.width, height: m.height } : {};
      await call("/api/edit", {
        op: "media",
        path: selectedPath,
        src: m.url,
        kind: m.kind,
        ...dims,
      });
    } catch (err) {
      setMessage({ text: (err as Error).message ?? "Upload failed.", error: true });
    } finally {
      setUploading(false);
    }
  }

  async function manualSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedPath) return;
    const fd = new FormData(e.currentTarget);
    if (kind === "text") await setField(selectedPath, String(fd.get("text") ?? ""));
    else if (kind === "media") {
      await setField(`${selectedPath}.alt`, String(fd.get("alt") ?? ""));
      if ((fd.get("caption") ?? "") !== "")
        await setField(`${selectedPath}.caption`, String(fd.get("caption")));
    } else if (kind === "cta") {
      await setField(`${selectedPath}.label`, String(fd.get("label") ?? ""));
      await setField(`${selectedPath}.href`, String(fd.get("href") ?? ""));
    }
  }

  async function seoSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!page) return;
    const fd = new FormData(e.currentTarget);
    await setField(`${pageSlug}.seo.titleTag`, String(fd.get("titleTag") ?? ""));
    await setField(`${pageSlug}.seo.metaDescription`, String(fd.get("metaDescription") ?? ""));
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 text-zinc-900">
      {selectedPath ? (
        <style>{`[data-edit="${cssEscape(selectedPath)}"]{outline:3px solid #2563eb!important;outline-offset:2px;border-radius:2px;}`}</style>
      ) : null}

      {/* Preview */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2 text-sm">
          <div className="flex items-center gap-3">
            <span aria-hidden>🐟</span>
            <span className="font-semibold">Editor</span>
            <select
              value={pageSlug}
              onChange={(e) => router.push(`/editor?page=${e.target.value}`)}
              className="rounded border border-zinc-300 px-2 py-1 text-xs"
            >
              {pages.map((p) => (
                <option key={p.slug} value={p.slug}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100">← Dashboard</Link>
            <form action={logout}>
              <button className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100">Sign out</button>
            </form>
          </div>
        </div>
        <div ref={previewRef} className="fs-editmode flex-1 overflow-auto">{children}</div>
      </div>

      {/* Panel */}
      <aside className="flex w-[380px] shrink-0 flex-col border-l border-zinc-200 bg-white">
        <div className="flex-1 overflow-auto">
          {/* Assistant (default) */}
          <div className="border-b border-zinc-200 px-4 py-4">
            <h2 className="text-sm font-semibold">Assistant</h2>
            {selectedPath ? (
              <div className="mt-2 flex items-center justify-between gap-2 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                <span className="truncate">Editing {kind}: {shortValue(selectedValue)}</span>
                <button onClick={() => setSelectedPath(null)} className="shrink-0 underline">clear</button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-500">
                Click an element on the page, then tell the assistant what to change — or just ask (e.g. “hide the gallery”).
              </p>
            )}
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendToAssistant();
              }}
              rows={3}
              placeholder="e.g. make this headline punchier, or hide the reviews section"
              className={fieldCls}
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="cursor-pointer rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50">
                📎 Attach photo/video
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setAttachedFile(f);
                    e.target.value = "";
                  }}
                />
              </label>
              {attachedFile ? (
                <span className="flex min-w-0 items-center gap-1 text-xs text-zinc-500">
                  <span className="truncate">{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="shrink-0 underline">
                    remove
                  </button>
                </span>
              ) : null}
            </div>
            <button
              onClick={sendToAssistant}
              disabled={sending || uploading || (!instruction.trim() && !attachedFile)}
              className={`${primaryBtn} mt-2 w-full`}
            >
              {uploading ? "Uploading…" : sending ? "Working…" : "Send to assistant"}
            </button>
            {attachedFile ? (
              <p className="mt-1 text-xs text-zinc-400">
                Tip: select an image slot to replace it, or say where it should go (e.g. “use this as the hero background”).
              </p>
            ) : null}
            {message ? (
              <p className={`mt-2 text-sm ${message.error ? "text-red-600" : "text-green-700"}`}>{message.text}</p>
            ) : null}

            {/* Headline education */}
            {selectedPath && /(\.headline|\.seo\.h1|\.heading)$/.test(selectedPath) ? (
              <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-800">
                💡 Strong headlines name your location and what you do — e.g. “Charleston Inshore Fishing Charters.” Your page title &amp; description stay SEO-optimized automatically.
              </p>
            ) : null}

            {/* Upload (primary action for media) */}
            {selectedPath && kind === "media" ? (
              <div className="mt-3">
                <label
                  className={`block w-full cursor-pointer text-center ${primaryBtn} ${uploading ? "opacity-60" : ""}`}
                >
                  {uploading ? "Uploading…" : "Upload image or video"}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="mt-1 text-xs text-zinc-400">
                  Images or video (MP4/WebM), up to 200MB.
                </p>
              </div>
            ) : null}

            {/* Manual override (hidden by default) */}
            {selectedPath && kind !== "unknown" ? (
              <div className="mt-3 border-t border-zinc-100 pt-3">
                <button onClick={() => setManualOpen((v) => !v)} className="text-xs font-medium text-zinc-500 hover:text-zinc-800">
                  {manualOpen ? "▾ Hide manual editing" : "▸ Edit manually"}
                </button>
                {manualOpen ? (
                  <form key={selectedPath} onSubmit={manualSave} className="mt-2 flex flex-col gap-2">
                    {kind === "text" ? (
                      <Labeled label="Text"><textarea name="text" defaultValue={String(selectedValue)} rows={3} className={fieldCls} /></Labeled>
                    ) : null}
                    {kind === "media" ? (
                      <>
                        <Labeled label="Alt text"><input name="alt" defaultValue={(selectedValue as { alt?: string }).alt ?? ""} className={fieldCls} /></Labeled>
                        <Labeled label="Caption"><input name="caption" defaultValue={(selectedValue as { caption?: string }).caption ?? ""} className={fieldCls} /></Labeled>
                      </>
                    ) : null}
                    {kind === "cta" ? (
                      <>
                        <Labeled label="Label"><input name="label" defaultValue={(selectedValue as { label?: string }).label ?? ""} className={fieldCls} /></Labeled>
                        <Labeled label="Link"><input name="href" defaultValue={(selectedValue as { href?: string }).href ?? ""} className={fieldCls} /></Labeled>
                      </>
                    ) : null}
                    <button disabled={sending} className={secondaryBtn}>Save manually</button>
                  </form>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Advanced SEO */}
          <div className="border-b border-zinc-200 px-4 py-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} />
              Advanced SEO
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              SEO is optimized automatically. Turn this on only if you want to override the title &amp; description for this page.
            </p>
            {advanced && page ? (
              <form key={`seo-${pageSlug}`} onSubmit={seoSave} className="mt-3 flex flex-col gap-2">
                <Labeled label="Page title (≤ 70 chars)"><input name="titleTag" defaultValue={page.seo.titleTag} maxLength={70} className={fieldCls} /></Labeled>
                <Labeled label="Meta description (≤ 160)"><textarea name="metaDescription" defaultValue={page.seo.metaDescription} rows={2} maxLength={160} className={fieldCls} /></Labeled>
                <button disabled={sending} className={secondaryBtn}>Save SEO</button>
              </form>
            ) : null}
          </div>

          {/* Sections */}
          <div className="px-4 py-4">
            <h2 className="text-sm font-semibold">Sections</h2>
            <p className="mt-1 text-xs text-zinc-500">Reorder, hide, or remove (or just ask the assistant).</p>
            <ul className="mt-3 flex flex-col gap-2">
              {sections.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1.5 text-sm">
                  <span className={`flex-1 truncate ${s.hidden ? "text-zinc-400 line-through" : ""}`}>{s.type}</span>
                  <SBtn title="Up" disabled={sending || i === 0} onClick={() => call("/api/edit", { op: "section", action: "up", pageSlug, sectionId: s.id })}>↑</SBtn>
                  <SBtn title="Down" disabled={sending || i === sections.length - 1} onClick={() => call("/api/edit", { op: "section", action: "down", pageSlug, sectionId: s.id })}>↓</SBtn>
                  <SBtn title={s.hidden ? "Show" : "Hide"} disabled={sending} onClick={() => call("/api/edit", { op: "section", action: s.hidden ? "show" : "hide", pageSlug, sectionId: s.id })}>{s.hidden ? "🙈" : "👁"}</SBtn>
                  <SBtn title="Remove" disabled={sending} onClick={() => { if (confirm(`Remove this ${s.type} section?`)) call("/api/edit", { op: "section", action: "remove", pageSlug, sectionId: s.id }); }}>✕</SBtn>
                </li>
              ))}
              {sections.length === 0 ? <li className="text-sm text-zinc-400">No sections.</li> : null}
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-400">
          Edits validate against the schema before saving. Design stays locked.
        </div>
      </aside>
    </div>
  );
}

const fieldCls =
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none";
const primaryBtn =
  "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50";
const secondaryBtn =
  "rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50";

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-zinc-400">
      {label}
      {children}
    </label>
  );
}

function SBtn({ children, title, disabled, onClick }: { children: ReactNode; title: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} className="grid size-7 place-items-center rounded border border-zinc-200 text-xs hover:bg-zinc-100 disabled:opacity-30">
      {children}
    </button>
  );
}

function cssEscape(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}

function imageDims(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
