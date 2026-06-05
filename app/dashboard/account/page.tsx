import { getCurrentUserId } from "@/lib/site";
import { getUserById } from "@/lib/users";
import { NameForm, PasswordForm } from "@/components/dashboard/AccountForms";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getUserById(await getCurrentUserId());

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-zinc-500">Manage your login and profile.</p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Email
        </h2>
        <p className="mt-1 font-medium">{user?.email}</p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <NameForm initialName={user?.name ?? ""} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
