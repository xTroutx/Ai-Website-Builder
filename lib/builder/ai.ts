/**
 * The AI edit proposer.
 *
 * MOCK implementation for now — it turns a captain's natural-language
 * instruction into a new value for one field, with no API key required. The
 * signature is deliberately identical to the real Claude version (see the
 * commented block at the bottom), so going live means swapping this function's
 * body, not its callers.
 *
 * The hard rule is upheld regardless of implementation: this only ever returns a
 * value for one field; the result must still pass setContent()'s Zod validation
 * before it can be saved. The AI cannot produce layout or invalid data here.
 */

export type ProposeEditInput = {
  /** The Site JSON dot-path being edited (e.g. "home.hero.headline"). */
  path: string;
  /** The current value of that field. */
  currentValue: string | number;
  /** The captain's instruction (free text from the chat). */
  instruction: string;
};

export type EditProposal = {
  /** The proposed new value for the field (always a string; coerced on apply). */
  value: string;
  /** A short, human-facing note about what was done. */
  note: string;
};

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Pull a quoted replacement out of instructions like: make it say "X". */
function extractQuoted(instruction: string): string | null {
  const m = instruction.match(/["“'](.+?)["”']/);
  return m ? m[1] : null;
}

export async function proposeEdit(
  input: ProposeEditInput,
): Promise<EditProposal> {
  const current = String(input.currentValue);
  const text = input.instruction.trim();
  const lower = text.toLowerCase();

  // 1) Explicit quoted replacement wins.
  const quoted = extractQuoted(text);
  if (quoted !== null) {
    return { value: quoted, note: "Replaced with the quoted text." };
  }

  // 2) Transform keywords operate on the current value.
  if (/\b(shorter|concise|trim|tighten)\b/.test(lower)) {
    const firstSentence = current.split(/(?<=[.!?])\s/)[0] ?? current;
    return { value: firstSentence.trim(), note: "Shortened the text." };
  }
  if (/\b(longer|expand|more detail|elaborate)\b/.test(lower)) {
    return {
      value: `${current} Book today to lock in your spot on the water.`,
      note: "Expanded the text.",
    };
  }
  if (/\b(uppercase|all caps|caps)\b/.test(lower)) {
    return { value: current.toUpperCase(), note: "Made it uppercase." };
  }
  if (/\blowercase\b/.test(lower)) {
    return { value: current.toLowerCase(), note: "Made it lowercase." };
  }
  if (/\btitle case\b/.test(lower)) {
    return { value: titleCase(current), note: "Applied title case." };
  }

  // 3) "change/set/make it ... to/with/say <X>" without quotes.
  const setTo = text.match(/(?:change|set|make|rewrite|replace)\b.*?\b(?:to|with|say|into)\s+(.+)$/i);
  if (setTo && setTo[1]) {
    return { value: setTo[1].trim(), note: "Updated the text." };
  }

  // 4) Default: treat the whole instruction as the new value. (A real Claude
  //    call would rewrite contextually; the mock just uses what you typed.)
  return { value: text, note: "Set to your text." };
}

/*
 * ── Real implementation (swap in when ANTHROPIC_API_KEY is set) ──────────────
 *
 * import Anthropic from "@anthropic-ai/sdk";
 * const client = new Anthropic();
 *
 * export async function proposeEdit(input: ProposeEditInput): Promise<EditProposal> {
 *   const msg = await client.messages.create({
 *     model: "claude-opus-4-8",
 *     max_tokens: 1024,
 *     thinking: { type: "adaptive" },
 *     tool_choice: { type: "tool", name: "set_content" },
 *     tools: [{
 *       name: "set_content",
 *       description:
 *         "Return the rewritten copy for a single website field. Plain text only — " +
 *         "never HTML, markdown, or layout. Keep it appropriate for the field.",
 *       input_schema: {
 *         type: "object",
 *         properties: { value: { type: "string" }, note: { type: "string" } },
 *         required: ["value"],
 *         additionalProperties: false,
 *       },
 *     }],
 *     system:
 *       "You edit ONE content field of a fishing-charter website. You only write " +
 *       "copy; you never produce layout, HTML, or CSS. Respect the field's role " +
 *       "(a headline stays short, a meta description stays under ~160 chars).",
 *     messages: [{
 *       role: "user",
 *       content:
 *         `Field path: ${input.path}\nCurrent value: ${JSON.stringify(input.currentValue)}\n` +
 *         `Instruction: ${input.instruction}\n\nCall set_content with the new value.`,
 *     }],
 *   });
 *   const toolUse = msg.content.find((b) => b.type === "tool_use");
 *   const out = toolUse?.input as { value: string; note?: string };
 *   return { value: out.value, note: out.note ?? "Updated." };
 *   // setContent() still re-validates the whole Site before this can be saved.
 * }
 */
