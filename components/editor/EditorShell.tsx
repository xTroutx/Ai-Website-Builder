"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-actions";

/**
 * The click-to-edit editor shell (Markup.io-style).
 *
 * Wraps the live, server-rendered preview (passed as `children`). Clicking any
 * element carrying a `data-edit` path selects it and scopes the chat to that
 * field. Submitting an instruction calls /api/edit, which runs it through the
 * (mock) AI + Zod-validated setContent, persists, and we refresh the preview.
 *
 * This component only ever sends { path, instruction } — it never touches the
 * Site JSON or any layout. Design stays locked; only content changes.
 */
export function EditorShell({
  children,
  pageLabel,
  liveHref,
}: {
  children: ReactNode;
  pageLabel: string;
  liveHref: string;
}) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [message, setMessage] = useState("");

  // Intercept clicks inside the preview: select [data-edit] targets, and block
  // navigation/form submits so the captain can click links/buttons to edit them.
  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const editable = target.closest<HTMLElement>("[data-edit]");
      // Always stop navigation within the preview.
      if (target.closest("a") || target.closest("button")) e.preventDefault();
      if (!editable) return;
      e.preventDefault();
      e.stopPropagation();
      const path = editable.getAttribute("data-edit");
      if (!path) return;
      setSelectedPath(path);
      setCurrentValue(editable.textContent?.trim() ?? "");
      setInstruction("");
      setStatus("idle");
      setMessage("");
      inputRef.current?.focus();
    };

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  async function apply() {
    if (!selectedPath || !instruction.trim()) return;
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedPath, instruction }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Edit failed.");
        return;
      }
      setStatus("done");
      setMessage(data.note ?? "Updated.");
      setCurrentValue(String(data.value));
      setInstruction("");
      router.refresh(); // re-render the preview from the updated store
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message ?? "Network error.");
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 text-zinc-900">
      {/* Highlight the currently selected element by its data-edit path. */}
      {selectedPath ? (
        <style>{`[data-edit="${cssEscape(selectedPath)}"]{outline:3px solid #2563eb!important;outline-offset:2px;border-radius:2px;}`}</style>
      ) : null}

      {/* Preview pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span aria-hidden>🐟</span>
            <span className="font-semibold">FishySites Editor</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-500">Editing: {pageLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              View live ↗
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div
          ref={previewRef}
          className="fs-editmode flex-1 overflow-auto"
          // The preview is interactive HTML; clicks are intercepted above.
        >
          {children}
        </div>
      </div>

      {/* Chat / edit panel */}
      <aside className="flex w-[360px] shrink-0 flex-col border-l border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h1 className="text-sm font-semibold">Edit content</h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            Click an element on the page, then tell the chat what to change.
          </p>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          {!selectedPath ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
              Nothing selected yet. Click any highlighted text, button, or image
              on the left to start editing it.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Editing
                </div>
                <code className="mt-1 block break-all rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                  {selectedPath}
                </code>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Current
                </div>
                <p className="mt-1 max-h-32 overflow-auto rounded bg-zinc-50 p-2 text-sm text-zinc-700">
                  {currentValue || <span className="text-zinc-400">(empty)</span>}
                </p>
              </div>
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Instruction
                <textarea
                  ref={inputRef}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) apply();
                  }}
                  rows={3}
                  placeholder='e.g. "make it shorter", "uppercase", or just type the new text'
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <button
                onClick={apply}
                disabled={status === "saving" || !instruction.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {status === "saving" ? "Applying…" : "Apply edit"}
              </button>
              {message ? (
                <p
                  className={[
                    "text-sm",
                    status === "error" ? "text-red-600" : "text-green-700",
                  ].join(" ")}
                >
                  {message}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-400">
          Mock AI · try “make it shorter”, “uppercase”, or type new copy. Edits
          are validated against the schema before saving.
        </div>
      </aside>
    </div>
  );
}

/** Minimal CSS attribute-value escape for the highlight selector. */
function cssEscape(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}
