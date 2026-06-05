import { parseSite, safeParseSite, type Site } from "../schema";
import { getValueAtPath, setValueAtPath } from "./paths";

/**
 * The mutation surface for Site JSON. These are the ONLY functions that change a
 * site's content — the AI/editor never writes the JSON directly. Every mutation
 * returns a fully re-validated Site (or throws), so an invalid edit can never be
 * persisted. This is what keeps the hard rule enforceable: the AI proposes a
 * value, and the value must survive the schema to take effect.
 */

export class InvalidEditError extends Error {
  constructor(
    message: string,
    readonly issues?: unknown,
  ) {
    super(message);
    this.name = "InvalidEditError";
  }
}

/**
 * Set the scalar content at a data-edit path. The incoming value is coerced to
 * match the existing field's type (e.g. a numeric price stays a number), then
 * the whole site is re-validated through Zod.
 */
export function setContent(
  site: Site,
  path: string,
  value: string | number,
): Site {
  const current = getValueAtPath(site, path);

  if (current !== undefined && typeof current === "object" && current !== null) {
    throw new InvalidEditError(
      `Path "${path}" points at a structured field, not editable text.`,
    );
  }

  // Coerce to the existing field's type so the schema stays satisfied.
  let next: string | number = value;
  if (typeof current === "number") {
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(n)) {
      throw new InvalidEditError(`"${value}" is not a valid number for "${path}".`);
    }
    next = n;
  } else {
    next = String(value);
  }

  const updated = setValueAtPath(site, path, next);

  const result = safeParseSite(updated);
  if (!result.success) {
    throw new InvalidEditError(
      `Edit to "${path}" failed validation.`,
      result.error.issues,
    );
  }
  return result.data;
}

/** Re-validate an arbitrary candidate site (used at the persistence boundary). */
export function validateSite(data: unknown): Site {
  return parseSite(data);
}
