"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

/**
 * Click-to-edit builder. Captains click any element on the live preview and edit
 * it directly (or via AI), switch pages, edit images/links, and manage which
 * sections show and in what order. Every change posts to /api/edit, which runs a
 * Zod-validated mutation and persists; the preview then refreshes.
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
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [initFor, setInitFor] = useState<string | null>(null);

  const sections =
    site.pages.find((p) => p.slug === pageSlug)?.sections ?? [];

  const selectedValue = (() => {
    if (!selectedPath) return undefined;
    try {
      return getValueAtPath(site, selectedPath);
    } catch {
      return undefined;
    }
  })();
  const kind = classify(selectedValue);

  // Initialize draft fields when the selection changes (render-time reset,
  // guarded so it runs once per selection — the supported alternative to a
  // setState-in-effect). Page switches remount the shell via a key, so
  // selection resets there automatically.
  if (selectedPath !== initFor) {
    setInitFor(selectedPath);
    if (kind === "text") setDraft({ text: String(selectedValue) });
    else if (kind === "media") {
      const m = selectedValue as { alt?: string; caption?: string };
      setDraft({ alt: m?.alt ?? "", caption: m?.caption ?? "" });
    } else if (kind === "cta") {
      const c = selectedValue as { label?: string; href?: string };
      setDraft({ label: c?.label ?? "", href: c?.href ?? "" });
    } else setDraft({});
    setInstruction("");
    setMessage(null);
  }

  // Intercept clicks in the preview: select [data-edit] targets; block nav.
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
      if (path) setSelectedPath(path);
    };
    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  const post = useCallback(
    async (body: Record<string, unknown>, okMsg: string) => {
      setSaving(true);
      setMessage(null);
      try {
        const res = await fetch("/api/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage({ text: data.error ?? "Edit failed.", error: true });
          return false;
        }
        setMessage({ text: okMsg });
        router.refresh();
        return true;
      } catch (err) {
        setMessage({ text: (err as Error).message ?? "Network error.", error: true });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [router],
  );

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
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100">
              ← Dashboard
            </Link>
            <form action={logout}>
              <button className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div ref={previewRef} className="fs-editmode flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Panel */}
      <aside className="flex w-[360px] shrink-0 flex-col border-l border-zinc-200 bg-white">
        <div className="flex-1 overflow-auto">
          {/* Selected element editor */}
          <div className="border-b border-zinc-200 px-4 py-4">
            <h2 className="text-sm font-semibold">Edit element</h2>
            {!selectedPath ? (
              <p className="mt-2 text-sm text-zinc-500">
                Click any text, image, or button on the page to edit it.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                <code className="block break-all rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                  {selectedPath}
                </code>

                {kind === "text" ? (
                  <>
                    <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Text
                      <textarea
                        value={draft.text ?? ""}
                        onChange={(e) => setDraft({ text: e.target.value })}
                        rows={3}
                        className={fieldCls}
                      />
                    </label>
                    <button
                      onClick={() => post({ op: "set", path: selectedPath, value: draft.text ?? "" }, "Saved.")}
                      disabled={saving}
                      className={primaryBtn}
                    >
                      Save text
                    </button>
                    <div className="border-t border-zinc-100 pt-3">
                      <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Or ask AI
                        <input
                          value={instruction}
                          onChange={(e) => setInstruction(e.target.value)}
                          placeholder="e.g. make it punchier"
                          className={fieldCls}
                        />
                      </label>
                      <button
                        onClick={() => post({ op: "ai", path: selectedPath, instruction }, "Updated by AI.")}
                        disabled={saving || !instruction.trim()}
                        className={`${secondaryBtn} mt-2`}
                      >
                        Ask AI
                      </button>
                    </div>
                  </>
                ) : null}

                {kind === "media" ? (
                  <>
                    <FieldInput label="Alt text" value={draft.alt ?? ""} onChange={(v) => setDraft((d) => ({ ...d, alt: v }))} />
                    <FieldInput label="Caption" value={draft.caption ?? ""} onChange={(v) => setDraft((d) => ({ ...d, caption: v }))} />
                    <button
                      onClick={async () => {
                        const ok = await post({ op: "set", path: `${selectedPath}.alt`, value: draft.alt ?? "" }, "Saved.");
                        if (ok && (draft.caption ?? "") !== "")
                          await post({ op: "set", path: `${selectedPath}.caption`, value: draft.caption ?? "" }, "Saved.");
                      }}
                      disabled={saving}
                      className={primaryBtn}
                    >
                      Save image details
                    </button>
                    <p className="text-xs text-zinc-400">Photo uploads are coming soon — alt text &amp; captions are editable now.</p>
                  </>
                ) : null}

                {kind === "cta" ? (
                  <>
                    <FieldInput label="Button label" value={draft.label ?? ""} onChange={(v) => setDraft((d) => ({ ...d, label: v }))} />
                    <FieldInput label="Link (URL or /path)" value={draft.href ?? ""} onChange={(v) => setDraft((d) => ({ ...d, href: v }))} />
                    <button
                      onClick={async () => {
                        const ok = await post({ op: "set", path: `${selectedPath}.label`, value: draft.label ?? "" }, "Saved.");
                        if (ok) await post({ op: "set", path: `${selectedPath}.href`, value: draft.href ?? "" }, "Saved.");
                      }}
                      disabled={saving}
                      className={primaryBtn}
                    >
                      Save button
                    </button>
                  </>
                ) : null}

                {kind === "unknown" ? (
                  <p className="text-sm text-zinc-500">This element isn&apos;t directly editable here.</p>
                ) : null}

                {message ? (
                  <p className={message.error ? "text-sm text-red-600" : "text-sm text-green-700"}>
                    {message.text}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* Sections manager */}
          <div className="px-4 py-4">
            <h2 className="text-sm font-semibold">Sections on this page</h2>
            <p className="mt-1 text-xs text-zinc-500">Reorder, hide, or remove sections.</p>
            <ul className="mt-3 flex flex-col gap-2">
              {sections.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1.5 text-sm">
                  <span className={`flex-1 truncate ${s.hidden ? "text-zinc-400 line-through" : ""}`}>
                    {s.type}
                  </span>
                  <SectionBtn title="Move up" disabled={saving || i === 0} onClick={() => post({ op: "section", action: "up", pageSlug, sectionId: s.id }, "Moved.")}>↑</SectionBtn>
                  <SectionBtn title="Move down" disabled={saving || i === sections.length - 1} onClick={() => post({ op: "section", action: "down", pageSlug, sectionId: s.id }, "Moved.")}>↓</SectionBtn>
                  <SectionBtn title={s.hidden ? "Show" : "Hide"} disabled={saving} onClick={() => post({ op: "section", action: s.hidden ? "show" : "hide", pageSlug, sectionId: s.id }, "Updated.")}>{s.hidden ? "🙈" : "👁"}</SectionBtn>
                  <SectionBtn title="Remove" disabled={saving} onClick={() => { if (confirm(`Remove this ${s.type} section?`)) post({ op: "section", action: "remove", pageSlug, sectionId: s.id }, "Removed."); }}>✕</SectionBtn>
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

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls} />
    </label>
  );
}

function SectionBtn({
  children,
  title,
  disabled,
  onClick,
}: {
  children: ReactNode;
  title: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="grid size-7 place-items-center rounded border border-zinc-200 text-xs hover:bg-zinc-100 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function cssEscape(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}
