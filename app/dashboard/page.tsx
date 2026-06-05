import Link from "next/link";
import { getSiteSummary } from "@/lib/site";
import { togglePublish } from "@/lib/dashboard-actions";
import { getTheme } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await getSiteSummary();
  const theme = getTheme(s.themeId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-zinc-500">Manage and edit {s.profileName}.</p>
      </div>

      {/* Site overview */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{s.profileName}</h2>
              <StatusBadge published={s.published} />
            </div>
            <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-zinc-600">
              <div>
                <dt className="inline text-zinc-400">Theme: </dt>
                <dd className="inline font-medium">{theme.name}</dd>
              </div>
              <div>
                <dt className="inline text-zinc-400">Pages: </dt>
                <dd className="inline font-medium">{s.pageCount}</dd>
              </div>
              <div>
                <dt className="inline text-zinc-400">Address: </dt>
                <dd className="inline font-medium">{s.slug}.fishysites.com</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/editor"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Edit site
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              View site ↗
            </a>
          </div>
        </div>

        {/* Publish toggle */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-5">
          <p className="text-sm text-zinc-600">
            {s.published
              ? "Your site is live."
              : "Your site is in draft — only you can see it."}
          </p>
          <form action={togglePublish}>
            <button
              className={[
                "rounded-md px-4 py-2 text-sm font-medium",
                s.published
                  ? "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  : "bg-emerald-600 text-white hover:bg-emerald-500",
              ].join(" ")}
            >
              {s.published ? "Switch to draft" : "Publish site"}
            </button>
          </form>
        </div>
      </section>

      {/* Getting started */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Getting started</h2>
        <ul className="mt-4 flex flex-col gap-3">
          <ChecklistItem done href="/editor" label="Your starter site is ready" />
          <ChecklistItem href="/editor" label="Customize your homepage — click any text to edit it" />
          <ChecklistItem href="/editor" label="Update your trips, rates, and photos" />
          <ChecklistItem
            done={s.published}
            href={undefined}
            label="Publish your site when you're ready"
          />
        </ul>
      </section>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={[
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        published
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700",
      ].join(" ")}
    >
      {published ? "Live" : "Draft"}
    </span>
  );
}

function ChecklistItem({
  label,
  href,
  done = false,
}: {
  label: string;
  href?: string;
  done?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-3">
      <span
        className={[
          "grid size-5 place-items-center rounded-full border text-xs",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-zinc-300 text-transparent",
        ].join(" ")}
        aria-hidden
      >
        ✓
      </span>
      <span className={done ? "text-zinc-400 line-through" : "text-zinc-700"}>
        {label}
      </span>
    </div>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className="hover:opacity-80">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}
