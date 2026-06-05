"use client";

import { useActionState } from "react";
import {
  changePassword,
  updateName,
  type AccountState,
} from "@/lib/dashboard-actions";

function Status({ state }: { state: AccountState }) {
  if (state.error) return <p className="text-sm text-red-600">{state.error}</p>;
  if (state.success)
    return <p className="text-sm text-emerald-700">{state.success}</p>;
  return null;
}

export function NameForm({ initialName }: { initialName: string }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    updateName,
    {},
  );
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-700">
        Your name
        <input
          name="name"
          defaultValue={initialName}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <Status state={state} />
      <button
        disabled={pending}
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save name"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    changePassword,
    {},
  );
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-700">
        Current password
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <label className="text-sm font-medium text-zinc-700">
        New password
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <Status state={state} />
      <button
        disabled={pending}
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pending ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}
