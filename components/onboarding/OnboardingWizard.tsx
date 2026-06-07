"use client";

import { useState, useTransition } from "react";
import {
  PALETTES,
  FONT_PAIRINGS,
  TEMPLATES,
  getPalette,
  getFontPairing,
  getTemplateDefaultAppearance,
  type Palette,
} from "@/lib/theme";
import { completeOnboarding } from "@/lib/onboarding-actions";

const FISHING_TYPES = [
  "Inshore",
  "Nearshore",
  "Offshore",
  "Fly Fishing",
  "Sight Fishing",
  "Bottom Fishing",
  "Trolling",
];

const STEPS = ["Your business", "Template", "Colors & fonts", "Review"];

export type WizardDefaults = {
  businessName: string;
  captainName: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  templateId: string;
  paletteId: string;
  fontId: string;
};

type FormState = WizardDefaults & {
  foundedYear: string;
  fishingTypes: string[];
  speciesText: string;
  description: string;
};

export function OnboardingWizard({ defaults }: { defaults: WizardDefaults }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    ...defaults,
    foundedYear: "",
    fishingTypes: [],
    speciesText: "",
    description: "",
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const interviewValid =
    form.businessName.trim() &&
    form.captainName.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.description.trim();

  function next() {
    setError("");
    if (step === 0 && !interviewValid) {
      setError("Please fill in all required fields.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish() {
    setError("");
    startTransition(async () => {
      const res = await completeOnboarding({
        businessName: form.businessName.trim(),
        captainName: form.captainName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
        fishingTypes: form.fishingTypes,
        species: form.speciesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        description: form.description.trim(),
        templateId: form.templateId,
        paletteId: form.paletteId,
        fontId: form.fontId,
      });
      if (res?.error) setError(res.error);
      // success path redirects server-side
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Progress */}
      <ol className="mb-8 flex items-center gap-2 text-xs font-medium">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "grid size-6 shrink-0 place-items-center rounded-full",
                i <= step ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-500",
              ].join(" ")}
            >
              {i + 1}
            </span>
            <span className={i === step ? "text-zinc-900" : "text-zinc-400"}>
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span className="h-px flex-1 bg-zinc-200" />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        {step === 0 && <InterviewStep form={form} set={set} />}
        {step === 1 && (
          <TemplateStep
            value={form.templateId}
            onChange={(id) => {
              // Picking a template applies the palette + fonts it was designed
              // around; the captain can still change them on the next step.
              const appearance = getTemplateDefaultAppearance(id);
              setForm((f) => ({
                ...f,
                templateId: id,
                paletteId: appearance.paletteId,
                fontId: appearance.fontId,
              }));
            }}
          />
        )}
        {step === 2 && (
          <CustomizerStep
            paletteId={form.paletteId}
            fontId={form.fontId}
            onPalette={(id) => set("paletteId", id)}
            onFont={(id) => set("fontId", id)}
          />
        )}
        {step === 3 && <ReviewStep form={form} />}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0 || pending}
            className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={pending}
              className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {pending ? "Building your site…" : "Finish & build my site"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700">
      {label} {required ? <span className="text-red-500">*</span> : null}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none";

function InterviewStep({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Tell us about your charter</h2>
      <p className="mt-1 text-sm text-zinc-500">
        We&apos;ll use this to build your starter site. You can edit everything later.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Business name" required>
          <input className={inputCls} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />
        </Field>
        <Field label="Captain name" required>
          <input className={inputCls} value={form.captainName} onChange={(e) => set("captainName", e.target.value)} />
        </Field>
        <Field label="City" required>
          <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="State" required>
          <input className={inputCls} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. SC" />
        </Field>
        <Field label="Contact phone" required>
          <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Contact email" required>
          <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Year started">
          <input className={inputCls} inputMode="numeric" value={form.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} placeholder="e.g. 2012" />
        </Field>
        <Field label="Target species">
          <input className={inputCls} value={form.speciesText} onChange={(e) => set("speciesText", e.target.value)} placeholder="Redfish, Trout, Tarpon" />
        </Field>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-zinc-700">Types of fishing</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {FISHING_TYPES.map((t) => {
            const on = form.fishingTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() =>
                  set(
                    "fishingTypes",
                    on
                      ? form.fishingTypes.filter((x) => x !== t)
                      : [...form.fishingTypes, t],
                  )
                }
                className={[
                  "rounded-full border px-3 py-1 text-sm",
                  on
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-50",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <Field label="Describe your charter" required>
          <textarea
            className={inputCls}
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What you offer, where you fish, who it's for…"
          />
        </Field>
      </div>
    </div>
  );
}

function TemplateStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Choose a template</h2>
      <p className="mt-1 text-sm text-zinc-500">Pick the layout for your site. More coming soon.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((t) => {
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              disabled={!t.available}
              onClick={() => t.available && onChange(t.id)}
              className={[
                "rounded-xl border p-4 text-left transition",
                selected
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-zinc-200 hover:border-zinc-300",
                !t.available ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <div className="mb-3 grid h-28 place-items-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400">
                {t.available ? "Preview" : "Coming soon"}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">{t.name}</span>
                {selected ? <span className="text-xs font-medium text-blue-600">Selected</span> : null}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{t.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CustomizerStep({
  paletteId,
  fontId,
  onPalette,
  onFont,
}: {
  paletteId: string;
  fontId: string;
  onPalette: (id: string) => void;
  onFont: (id: string) => void;
}) {
  const palette = getPalette(paletteId);
  const font = getFontPairing(fontId);
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Colors &amp; fonts</h2>
      <p className="mt-1 text-sm text-zinc-500">Pick a color palette and a font pairing.</p>

      {/* Live preview */}
      <div
        className="mt-5 overflow-hidden rounded-xl border border-zinc-200"
        style={{ background: palette.colors.bg, color: palette.colors.text }}
      >
        <div className="p-6">
          <div
            className="text-2xl font-bold uppercase"
            style={{ fontFamily: font.heading, color: palette.colors.text }}
          >
            {palette.colors.bg ? "Your Charter Awaits" : ""}
          </div>
          <p className="mt-1 text-sm" style={{ fontFamily: font.body, color: palette.colors.muted }}>
            A preview of your colors and fonts.
          </p>
          <span
            className="mt-3 inline-block px-4 py-2 text-sm font-semibold"
            style={{ background: palette.colors.primary, color: palette.colors.primaryContrast }}
          >
            Book Now
          </span>
        </div>
      </div>

      {/* Palette picker */}
      <h3 className="mt-6 text-sm font-medium text-zinc-700">Color palette</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PALETTES.map((p: Palette) => {
          const selected = p.id === paletteId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPalette(p.id)}
              className={[
                "rounded-lg border p-3 text-left",
                selected ? "border-blue-600 ring-2 ring-blue-200" : "border-zinc-200 hover:border-zinc-300",
              ].join(" ")}
            >
              <div className="flex gap-1">
                {[p.colors.bg, p.colors.primary, p.colors.accent, p.colors.surfaceAlt ?? p.colors.surface].map(
                  (c, i) => (
                    <span key={i} className="size-5 rounded-full border border-black/10" style={{ background: c }} />
                  ),
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-zinc-800">{p.name}</div>
            </button>
          );
        })}
      </div>

      {/* Font picker */}
      <h3 className="mt-6 text-sm font-medium text-zinc-700">Font pairing</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FONT_PAIRINGS.map((f) => {
          const selected = f.id === fontId;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFont(f.id)}
              className={[
                "rounded-lg border p-3 text-left",
                selected ? "border-blue-600 ring-2 ring-blue-200" : "border-zinc-200 hover:border-zinc-300",
              ].join(" ")}
            >
              <div className="text-lg font-bold text-zinc-900" style={{ fontFamily: f.heading }}>
                {f.name}
              </div>
              <div className="text-xs text-zinc-500" style={{ fontFamily: f.body }}>
                The quick brown fox
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewStep({ form }: { form: FormState }) {
  const rows: [string, string][] = [
    ["Business", form.businessName],
    ["Captain", form.captainName],
    ["Location", [form.city, form.state].filter(Boolean).join(", ")],
    ["Phone", form.phone],
    ["Email", form.email],
    ["Fishing", form.fishingTypes.join(", ") || "—"],
    ["Species", form.speciesText || "—"],
    ["Template", form.templateId],
    ["Palette", form.paletteId],
    ["Font", form.fontId],
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Review &amp; build</h2>
      <p className="mt-1 text-sm text-zinc-500">
        We&apos;ll generate your site from this. You can refine everything in the editor afterward.
      </p>
      <dl className="mt-6 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-2.5 text-sm">
            <dt className="w-28 shrink-0 text-zinc-400">{k}</dt>
            <dd className="text-zinc-800">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
