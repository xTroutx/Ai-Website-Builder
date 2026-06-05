"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate, type AuthFormState } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    authenticate,
    {},
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span aria-hidden className="text-2xl">🐟</span>
          <span className="text-lg font-bold text-zinc-900">FishySites</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">Log in to edit your charter site.</p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-medium text-zinc-700">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none"
            />
          </label>
          {state.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New here?{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
