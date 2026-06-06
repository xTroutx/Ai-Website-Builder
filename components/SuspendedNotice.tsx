import Link from "next/link";

/** Shown in place of the editor / public site when a site is suspended. */
export function SuspendedNotice({ showDashboardLink = false }: { showDashboardLink?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 text-center">
      <div className="max-w-md">
        <div className="text-4xl" aria-hidden>
          ⚓
        </div>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          This site is temporarily unavailable
        </h1>
        <p className="mt-2 text-zinc-600">
          This account is suspended. If you&apos;re the owner, please contact
          billing to reinstate your site.
        </p>
        {showDashboardLink ? (
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Back to dashboard
          </Link>
        ) : null}
      </div>
    </div>
  );
}
