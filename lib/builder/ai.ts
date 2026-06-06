import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "../settings";

/**
 * The AI edit proposer: turns a captain's natural-language instruction into a
 * new value for ONE field.
 *
 * - If a platform Anthropic key is configured (admin console or env), it calls
 *   Claude with a single `set_content` tool.
 * - Otherwise it falls back to a deterministic mock so the editor still works
 *   with no key.
 *
 * The hard rule holds either way: this only returns a value for one field, and
 * setContent()'s Zod validation still decides whether it can be saved. The AI
 * never produces layout or invalid data.
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

export async function proposeEdit(
  input: ProposeEditInput,
): Promise<EditProposal> {
  const apiKey = await getAnthropicApiKey();
  return apiKey ? claudePropose(input, apiKey) : mockPropose(input);
}

// ── Live Claude ────────────────────────────────────────────────────────────
async function claudePropose(
  input: ProposeEditInput,
  apiKey: string,
): Promise<EditProposal> {
  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    tool_choice: { type: "tool", name: "set_content" },
    tools: [
      {
        name: "set_content",
        description:
          "Return the rewritten copy for a single website field. Plain text " +
          "only — never HTML, markdown, or layout. Keep it appropriate for the " +
          "field (a headline stays short; a meta description stays under ~155 chars).",
        input_schema: {
          type: "object",
          properties: {
            value: { type: "string", description: "The new field value." },
            note: { type: "string", description: "Short note on what changed." },
          },
          required: ["value"],
          additionalProperties: false,
        },
      },
    ],
    system:
      "You edit ONE content field of a fishing-charter website. You only write " +
      "marketing copy; you never produce layout, HTML, or CSS. Respect the " +
      "field's role and keep the captain's voice. Always call set_content.",
    messages: [
      {
        role: "user",
        content:
          `Field path: ${input.path}\n` +
          `Current value: ${JSON.stringify(input.currentValue)}\n` +
          `Instruction: ${input.instruction}\n\n` +
          "Call set_content with the new value.",
      },
    ],
  });

  const toolUse = msg.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("The AI did not return an edit. Please try again.");
  }
  const out = toolUse.input as { value?: string; note?: string };
  if (!out?.value) throw new Error("The AI returned an empty value.");
  return { value: out.value, note: out.note ?? "Updated." };
}

// ── Mock (no key configured) ─────────────────────────────────────────────────
function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractQuoted(instruction: string): string | null {
  const m = instruction.match(/["“'](.+?)["”']/);
  return m ? m[1] : null;
}

function mockPropose(input: ProposeEditInput): EditProposal {
  const current = String(input.currentValue);
  const text = input.instruction.trim();
  const lower = text.toLowerCase();

  const quoted = extractQuoted(text);
  if (quoted !== null) return { value: quoted, note: "Replaced with the quoted text." };

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
  if (/\b(uppercase|all caps|caps)\b/.test(lower))
    return { value: current.toUpperCase(), note: "Made it uppercase." };
  if (/\blowercase\b/.test(lower))
    return { value: current.toLowerCase(), note: "Made it lowercase." };
  if (/\btitle case\b/.test(lower))
    return { value: titleCase(current), note: "Applied title case." };

  const setTo = text.match(/(?:change|set|make|rewrite|replace)\b.*?\b(?:to|with|say|into)\s+(.+)$/i);
  if (setTo && setTo[1]) return { value: setTo[1].trim(), note: "Updated the text." };

  return { value: text, note: "Set to your text." };
}
