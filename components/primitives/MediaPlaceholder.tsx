import Image from "next/image";
import type { Media } from "@/lib/schema";

/**
 * Renders a media slot. When the captain has uploaded an asset (`src` set) it
 * renders the real image (optimized via next/image) or a video; otherwise it
 * draws a tokenized, labelled placeholder. The slot carries `data-edit` so the
 * builder can select it (to upload/replace, or edit alt/caption).
 */
export function MediaPlaceholder({
  media,
  path,
  className,
  ratio = "16 / 9",
  rounded = true,
}: {
  media: Media;
  path: string;
  className?: string;
  ratio?: string;
  rounded?: boolean;
}) {
  const aspectRatio =
    media.width && media.height ? `${media.width} / ${media.height}` : ratio;

  const frame = [
    "relative overflow-hidden",
    rounded ? "rounded-theme" : "",
    className ?? "",
  ].join(" ");

  if (media.src && media.kind === "video") {
    return (
      <div data-edit={path} className={frame} style={{ aspectRatio }}>
        <video
          src={media.src}
          className="absolute inset-0 size-full object-cover"
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  if (media.src) {
    return (
      <div data-edit={path} className={frame} style={{ aspectRatio }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {media.caption ? (
          <span className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 text-xs text-white">
            {media.caption}
          </span>
        ) : null}
      </div>
    );
  }

  // No asset yet — tokenized placeholder labelled with the alt text.
  return (
    <div
      data-edit={path}
      role="img"
      aria-label={media.alt}
      className={[
        "flex items-center justify-center bg-surface text-muted border border-line",
        frame,
      ].join(" ")}
      style={{ aspectRatio }}
    >
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
