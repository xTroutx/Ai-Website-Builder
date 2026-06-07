import Anthropic from "@anthropic-ai/sdk";
import type { Site } from "../schema";
import { getValueAtPath, isProtectedPath } from "./paths";
import {
  setContent,
  setSectionHidden,
  moveSection,
  removeSection,
  setSectionMedia,
  setSectionAlign,
  addSection,
  addArrayItem,
  removeArrayItem,
  ADDABLE_SECTION_TYPES,
} from "./mutations";

/**
 * The editor's tool-using agent. Claude is given the current page context + the
 * captain's clicked element, and edits the site by calling our Zod-validated
 * mutation tools (it never writes JSON or layout directly). Field edits act on
 * the selected element; section edits target a section by id.
 *
 * SEO stays platform-managed unless `advanced` is on. The mutations are the same
 * ones the manual override uses, so every change is validated identically.
 */

export type RunAgentArgs = {
  apiKey: string;
  message: string;
  pageSlug: string;
  selectedPath: string | null;
  advanced: boolean;
  site: Site;
  /** An image/video the captain attached in chat, for the agent to place. */
  attachment?: { url: string; kind: "image" | "video" } | null;
};

export type RunAgentResult = { site: Site; summary: string; changed: number };

function classify(value: unknown): "text" | "media" | "cta" | "unknown" {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "string" || typeof value === "number") return "text";
  if (typeof value === "object") {
    if ("alt" in value) return "media";
    if ("label" in value && "href" in value) return "cta";
  }
  return "unknown";
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: "set_text",
    description:
      "Set the SELECTED text element to a new value. Use for headlines, body copy, labels, etc. Plain text only.",
    input_schema: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
    },
  },
  {
    name: "set_image",
    description: "Update the SELECTED image's alt text and/or caption.",
    input_schema: {
      type: "object",
      properties: { alt: { type: "string" }, caption: { type: "string" } },
    },
  },
  {
    name: "set_button",
    description: "Update the SELECTED button/link's label and/or destination URL.",
    input_schema: {
      type: "object",
      properties: { label: { type: "string" }, href: { type: "string" } },
    },
  },
  {
    name: "set_section_visibility",
    description: "Show or hide a section on the current page (by section id).",
    input_schema: {
      type: "object",
      properties: { sectionId: { type: "string" }, hidden: { type: "boolean" } },
      required: ["sectionId", "hidden"],
    },
  },
  {
    name: "move_section",
    description: "Move a section up or down on the current page (by section id).",
    input_schema: {
      type: "object",
      properties: {
        sectionId: { type: "string" },
        direction: { type: "string", enum: ["up", "down"] },
      },
      required: ["sectionId", "direction"],
    },
  },
  {
    name: "remove_section",
    description: "Remove a section from the current page (by section id).",
    input_schema: {
      type: "object",
      properties: { sectionId: { type: "string" } },
      required: ["sectionId"],
    },
  },
  {
    name: "set_section_align",
    description:
      "Set a section's content alignment to 'left' or 'center' (by section id). Affects the section's heading and copy.",
    input_schema: {
      type: "object",
      properties: {
        sectionId: { type: "string" },
        align: { type: "string", enum: ["left", "center"] },
      },
      required: ["sectionId", "align"],
    },
  },
  {
    name: "add_section",
    description:
      "Add a NEW section to the current page with placeholder content the user can then edit. Optionally insert it after an existing section (afterSectionId); otherwise it's appended to the end.",
    input_schema: {
      type: "object",
      properties: {
        sectionType: { type: "string", enum: ADDABLE_SECTION_TYPES },
        afterSectionId: { type: "string" },
      },
      required: ["sectionType"],
    },
  },
  {
    name: "add_list_item",
    description:
      "Add a new item to a repeating LIST (e.g. another 'what's included' line, an extra rate-table row, an additional card, a gallery photo, an FAQ entry). Pass the data-edit `path` of the list or of any item in it — usually the SELECTED element's path. The new item copies the last one's shape; tell the user to edit it.",
    input_schema: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
  },
  {
    name: "remove_list_item",
    description:
      "Remove an item from a repeating list. Pass the data-edit `path` of the item to remove (usually the SELECTED element's path). A list always keeps at least one item.",
    input_schema: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
  },
];

// Offered only when the captain attached an image/video.
const PLACE_MEDIA_TOOL: Anthropic.Tool = {
  name: "place_attached_media",
  description:
    "Place the user's ATTACHED image/video onto a section as its background/photo. Works for hero, mediaText, and ctaBanner sections (by section id). For a specific gallery/card image, the user should click that slot instead.",
  input_schema: {
    type: "object",
    properties: { sectionId: { type: "string" } },
    required: ["sectionId"],
  },
};

function applyTool(
  site: Site,
  args: RunAgentArgs,
  name: string,
  input: Record<string, unknown>,
): Site {
  const { selectedPath, pageSlug, advanced } = args;

  const requireSelected = (): string => {
    if (!selectedPath) throw new Error("No element is selected. Ask the user to click one.");
    return selectedPath;
  };
  const guardSeo = (path: string) => {
    if (isProtectedPath(path) && !advanced) {
      throw new Error("That is an SEO field, which is managed automatically (Advanced SEO is off).");
    }
  };

  switch (name) {
    case "set_text": {
      const path = requireSelected();
      guardSeo(path);
      return setContent(site, path, String(input.value ?? ""));
    }
    case "set_image": {
      const path = requireSelected();
      let next = site;
      if (typeof input.alt === "string") next = setContent(next, `${path}.alt`, input.alt);
      if (typeof input.caption === "string") next = setContent(next, `${path}.caption`, input.caption);
      return next;
    }
    case "set_button": {
      const path = requireSelected();
      let next = site;
      if (typeof input.label === "string") next = setContent(next, `${path}.label`, input.label);
      if (typeof input.href === "string") next = setContent(next, `${path}.href`, input.href);
      return next;
    }
    case "set_section_visibility":
      return setSectionHidden(site, pageSlug, String(input.sectionId), Boolean(input.hidden));
    case "move_section":
      return moveSection(site, pageSlug, String(input.sectionId), input.direction === "up" ? -1 : 1);
    case "remove_section":
      return removeSection(site, pageSlug, String(input.sectionId));
    case "set_section_align":
      return setSectionAlign(site, pageSlug, String(input.sectionId), input.align === "center" ? "center" : "left");
    case "add_section":
      return addSection(
        site,
        pageSlug,
        String(input.sectionType),
        input.afterSectionId ? String(input.afterSectionId) : undefined,
      );
    case "add_list_item": {
      const path = String(input.path || selectedPath || "");
      if (!path) throw new Error("No list path or selected element to add to.");
      guardSeo(path);
      return addArrayItem(site, path);
    }
    case "remove_list_item": {
      const path = String(input.path || selectedPath || "");
      if (!path) throw new Error("No list item path or selected element to remove.");
      guardSeo(path);
      return removeArrayItem(site, path);
    }
    case "place_attached_media": {
      if (!args.attachment) throw new Error("No image is attached to place.");
      return setSectionMedia(site, pageSlug, String(input.sectionId), {
        src: args.attachment.url,
        kind: args.attachment.kind,
      });
    }
    default:
      throw new Error(`Unknown tool "${name}".`);
  }
}

function buildContext(args: RunAgentArgs): string {
  const page = args.site.pages.find((p) => p.slug === args.pageSlug);
  const sections = (page?.sections ?? [])
    .map((s) => `  - ${s.id} — ${s.type}${s.hidden ? " (hidden)" : ""}`)
    .join("\n");

  let selected = "none (no element clicked)";
  if (args.selectedPath) {
    let value: unknown;
    try {
      value = getValueAtPath(args.site, args.selectedPath);
    } catch {
      value = undefined;
    }
    selected = `${args.selectedPath} — type ${classify(value)} — current: ${JSON.stringify(value)}`;
  }

  return [
    `Current page: ${args.pageSlug}`,
    `Selected element: ${selected}`,
    `Sections on this page:\n${sections || "  (none)"}`,
    `Advanced SEO: ${args.advanced ? "ON (you may edit SEO fields)" : "OFF (SEO is automatic; do not edit page title/description)"}`,
    args.attachment
      ? `Attached media: the user attached a ${args.attachment.kind} to place — use place_attached_media with the right section id (e.g. the hero or a cta).`
      : "",
    "",
    `Captain's request: ${args.message}`,
  ].join("\n");
}

export async function runAgent(args: RunAgentArgs): Promise<RunAgentResult> {
  const client = new Anthropic({ apiKey: args.apiKey });
  let site = args.site;
  let changed = 0;

  const system =
    "You are the FishySites editor assistant. You help a fishing-charter owner " +
    "edit their website by calling the provided tools. You ONLY change content; " +
    "you never produce HTML, CSS, or layout. Field edits (text/image/button) act " +
    "on the user's SELECTED element. Section actions target a section by its id " +
    "from the list. Make all the changes the request implies, then reply with one " +
    "short sentence describing what you did. If the request needs a selected " +
    "element and none is selected, say so instead of guessing.";

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildContext(args) },
  ];

  for (let i = 0; i < 6; i++) {
    const resp = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system,
      tools: args.attachment ? [...TOOLS, PLACE_MEDIA_TOOL] : TOOLS,
      messages,
    });
    messages.push({ role: "assistant", content: resp.content });

    const toolUses = resp.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    if (resp.stop_reason !== "tool_use" || toolUses.length === 0) {
      const text = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join(" ")
        .trim();
      return {
        site,
        summary: text || `Done — ${changed} change${changed === 1 ? "" : "s"}.`,
        changed,
      };
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      try {
        site = applyTool(site, args, tu.name, tu.input as Record<string, unknown>);
        changed++;
        results.push({ type: "tool_result", tool_use_id: tu.id, content: "ok" });
      } catch (err) {
        results.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: (err as Error).message,
          is_error: true,
        });
      }
    }
    messages.push({ role: "user", content: results });
  }

  return { site, summary: `Applied ${changed} change(s).`, changed };
}
