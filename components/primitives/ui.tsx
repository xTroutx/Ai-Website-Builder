import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta } from "@/lib/schema";
import { Editable } from "./Editable";

/** Centered max-width content container matching the design's 1440/100px frame. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[100px]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/** The signature blue accent bar that sits under section headings. */
export function AccentBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={["h-[6px] w-[88px] bg-primary", className ?? ""].join(" ")}
    />
  );
}

/**
 * A section's editable heading (h2) in the design's condensed uppercase display
 * face, with the accent bar beneath. Renders nothing when no text is given.
 */
export function SectionHeading({
  text,
  path,
  align = "left",
  showBar = true,
  className,
}: {
  text?: string;
  path: string;
  align?: "left" | "center";
  showBar?: boolean;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div
      className={[
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        className ?? "",
      ].join(" ")}
    >
      <Editable
        as="h2"
        path={path}
        className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight sm:text-5xl"
      >
        {text}
      </Editable>
      {showBar ? <AccentBar /> : null}
    </div>
  );
}

/** Small uppercase eyebrow/kicker above a heading. */
export function Eyebrow({
  text,
  path,
  className,
}: {
  text: string;
  path: string;
  className?: string;
}) {
  return (
    <Editable
      as="p"
      path={path}
      className={[
        "font-heading text-sm font-bold uppercase tracking-[0.2em] text-primary",
        className ?? "",
      ].join(" ")}
    >
      {text}
    </Editable>
  );
}

/** Right-pointing chevron used on inline link CTAs. */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={["size-5 shrink-0", className ?? ""].join(" ")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

const ctaClassName: Record<Cta["variant"], string> = {
  // Solid blue block, uppercase condensed type, sharp corners.
  primary:
    "bg-primary text-on-primary px-7 py-[15px] font-heading font-bold uppercase tracking-[0.06em] text-[17px] rounded-theme hover:opacity-90",
  // Outlined; border + text inherit the current color so it works on any band.
  secondary:
    "border border-current px-7 py-[15px] font-heading font-bold uppercase tracking-[0.06em] text-[17px] rounded-theme hover:opacity-80",
  // Inline text link with chevron (e.g. "Learn more ›").
  link: "gap-1 font-heading font-bold uppercase tracking-[0.06em] text-[18px] hover:opacity-80",
};

/**
 * A call-to-action. Internal paths use next/link; external/tel/mailto use a
 * plain anchor. The whole CTA is editable (data-edit -> the cta field).
 */
export function CtaLink({
  cta,
  path,
  className,
}: {
  cta: Cta;
  path: string;
  className?: string;
}) {
  const cls = [
    "inline-flex items-center justify-center text-center transition",
    ctaClassName[cta.variant],
    className ?? "",
  ].join(" ");

  const content =
    cta.variant === "link" ? (
      <>
        {cta.label}
        <Chevron />
      </>
    ) : (
      cta.label
    );

  const isInternal = cta.href.startsWith("/") && !cta.external;

  if (isInternal) {
    return (
      <Link href={cta.href} data-edit={path} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={cta.href}
      data-edit={path}
      className={cls}
      {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

/** Star rating display (1–5). */
export function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="text-primary" aria-label={`${full} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="opacity-30">{"★".repeat(5 - full)}</span>
    </span>
  );
}
