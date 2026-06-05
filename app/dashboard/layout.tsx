import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Dashboard · FishySites",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span aria-hidden>🐟</span> FishySites
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/editor">Editor</NavLink>
            <NavLink href="/dashboard/account">Account</NavLink>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-3 py-1.5 text-zinc-600 hover:bg-zinc-100"
            >
              View site ↗
            </a>
            <form action={logout}>
              <button className="ml-1 rounded border border-zinc-300 px-3 py-1.5 text-zinc-600 hover:bg-zinc-100">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded px-3 py-1.5 text-zinc-700 hover:bg-zinc-100">
      {children}
    </Link>
  );
}
