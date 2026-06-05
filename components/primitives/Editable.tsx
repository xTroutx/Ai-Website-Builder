import type { ElementType, ReactNode } from "react";

/**
 * Wraps a piece of editable CONTENT and stamps it with a `data-edit` attribute
 * carrying its dot-path into the Site JSON (e.g. "home.hero.headline"). The
 * click-to-edit overlay (built later) reads this attribute to target the chat at
 * exactly this field. Templates use this for every captain-editable value.
 *
 * Polymorphic: pass `as` to control the rendered tag (defaults to <span>).
 */
export function Editable({
  as,
  path,
  className,
  children,
}: {
  /** The element/tag to render. */
  as?: ElementType;
  /** Dot-path into the Site JSON this content maps to. */
  path: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? "span";
  return (
    <Tag data-edit={path} className={className}>
      {children}
    </Tag>
  );
}

/** Join path segments into a single dot-path (skips empty segments). */
export function editPath(...parts: Array<string | number>): string {
  return parts.filter((p) => p !== "" && p !== undefined).join(".");
}
