import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/site";
import { logout } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Admin · FishySites",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Platform-admin only. Non-admins are bounced to their dashboard.
  if (!(await isCurrentUserAdmin())) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span aria-hidden>🐟</span> FishySites
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
              ADMIN
            </span>
          </Link>
          <form action={logout}>
            <button className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
