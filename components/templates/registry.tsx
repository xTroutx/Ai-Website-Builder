import type { ComponentType } from "react";
import type { Page, Site } from "@/lib/schema";
import { CoastalPageView } from "./coastal-view";

/**
 * Registry of template VIEWS — the React renderers that turn Site JSON into a
 * designed page. A site's `templateId` selects which one renders, so the same
 * content can appear in any design (powering template comparison + design swaps).
 *
 * To add a template: build a `({ site, page })` component (its own chrome +
 * section layouts, using the shared editable primitives) and register it here
 * under its id. Keep the id in sync with lib/theme/templates.ts.
 */
export type TemplateView = {
  id: string;
  name: string;
  PageView: ComponentType<{ site: Site; page: Page }>;
};

export const TEMPLATE_VIEWS: Record<string, TemplateView> = {
  coastal: { id: "coastal", name: "Coastal", PageView: CoastalPageView },
};

/** Resolve a template view by id, falling back to Coastal for unimplemented ids. */
export function getTemplateView(id: string): TemplateView {
  return TEMPLATE_VIEWS[id] ?? TEMPLATE_VIEWS.coastal;
}

/** Ids that actually have a renderer (a subset of the curated template list). */
export const IMPLEMENTED_TEMPLATE_IDS = Object.keys(TEMPLATE_VIEWS);
