import type { Media } from "@/lib/schema";

/**
 * Renders a media slot. This session it always draws a tokenized, solid-color
 * placeholder labelled with the image's `alt` text (per the "solid-color
 * placeholders" decision) — no external/binary assets.
 *
 * When real assets arrive, the only change here is swapping the placeholder
 * branch for `next/image`; the schema (`Media`) and every call site stay put.
 * The slot carries `data-edit` so clicking it targets the media field, and the
 * `alt` text is itself editable content.
 */
export function MediaPlaceholder({
  media,
  path,
  className,
  ratio = "16 / 9",
  rounded = true,
}: {
  media: Media;
  /** Dot-path of this media field in the Site JSON. */
  path: string;
  className?: string;
  /** CSS aspect-ratio; overridden by intrinsic dimensions when present. */
  ratio?: string;
  rounded?: boolean;
}) {
  const aspectRatio =
    media.width && media.height ? `${media.width} / ${media.height}` : ratio;

  // Future: if (media.src) return <Image .../>
  return (
    <div
      data-edit={path}
      role="img"
      aria-label={media.alt}
      className={[
        "relative flex items-center justify-center overflow-hidden",
        "bg-surface text-muted border border-line",
        rounded ? "rounded-theme" : "",
        className ?? "",
      ].join(" ")}
      style={{ aspectRatio }}
    >
      {/* Decorative diagonal wash so placeholders read as image slots. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 12px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-1 px-4 py-6 text-center">
        <span aria-hidden className="text-2xl leading-none">
          🐟
        </span>
        <span className="text-xs font-medium leading-snug max-w-[28ch]">
          {media.alt}
        </span>
        {media.caption ? (
          <span className="text-[0.7rem] opacity-70">{media.caption}</span>
        ) : null}
      </div>
    </div>
  );
}
