import { listAllSites, getPlatformCounts } from "@/lib/store-db";
import { toggleSuspendAction, saveAnthropicKeyAction } from "@/lib/admin-actions";
import { getAnthropicKeyStatus } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [counts, sites, aiStatus] = await Promise.all([
    getPlatformCounts(),
    listAllSites(),
    getAnthropicKeyStatus(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Platform admin</h1>
        <p className="text-zinc-400">Monitor and manage all clients and sites.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Clients" value={counts.users} />
        <Stat label="Sites" value={counts.sites} />
        <Stat label="Published" value={counts.published} />
        <Stat label="Suspended" value={counts.suspended} accent="amber" />
      </div>

      {/* Integrations */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          AI integration (Anthropic)
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={[
              "inline-block size-2.5 rounded-full",
              aiStatus.connected ? "bg-emerald-400" : "bg-zinc-500",
            ].join(" ")}
          />
          <span className="font-medium">
            {aiStatus.connected ? "Connected" : "Not configured"}
          </span>
          {aiStatus.connected ? (
            <span className="text-sm text-zinc-400">
              Key ••••{aiStatus.last4} ·{" "}
              {aiStatus.source === "admin" ? "set in admin" : "from environment"} ·
              used by all client sites
            </span>
          ) : (
            <span className="text-sm text-zinc-400">
              Paste a key below to enable AI editing for all sites.
            </span>
          )}
        </div>

        <form
          action={saveAnthropicKeyAction}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="intent" value="save" />
          <input
            type="password"
            name="apiKey"
            autoComplete="off"
            placeholder="sk-ant-..."
            className="w-72 max-w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
          />
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
            Save key
          </button>
        </form>
        {aiStatus.source === "admin" ? (
          <form action={saveAnthropicKeyAction} className="mt-2">
            <input type="hidden" name="intent" value="remove" />
            <button className="text-xs text-zinc-400 underline hover:text-zinc-200">
              Remove stored key
            </button>
          </form>
        ) : null}
      </section>

      {/* Sites table */}
      <section className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {sites.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-zinc-300">{s.owner?.email ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{s.slug}.fishysites.com</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Badge tone={s.published ? "green" : "zinc"}>
                      {s.published ? "Live" : "Draft"}
                    </Badge>
                    {s.suspended ? <Badge tone="amber">Suspended</Badge> : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {new Date(s.createdAt).toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <form action={toggleSuspendAction}>
                    <input type="hidden" name="siteId" value={s.id} />
                    <input
                      type="hidden"
                      name="suspended"
                      value={(!s.suspended).toString()}
                    />
                    <button
                      className={[
                        "rounded px-3 py-1.5 text-xs font-medium",
                        s.suspended
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-amber-600 text-white hover:bg-amber-500",
                      ].join(" ")}
                    >
                      {s.suspended ? "Reinstate" : "Suspend"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {sites.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No sites yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber";
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div
        className={[
          "text-3xl font-bold",
          accent === "amber" && value > 0 ? "text-amber-400" : "text-zinc-100",
        ].join(" ")}
      >
        {value}
      </div>
      <div className="mt-1 text-sm text-zinc-400">{label}</div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "zinc";
  children: React.ReactNode;
}) {
  const cls = {
    green: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    zinc: "bg-zinc-700/40 text-zinc-300",
  }[tone];
  return (
    <span className={["rounded-full px-2 py-0.5 text-xs font-medium", cls].join(" ")}>
      {children}
    </span>
  );
}
