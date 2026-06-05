import { parseSite, type Site } from "../schema";
import { lowcountryRedfish } from "./lowcountry-redfish";

/**
 * The sample site, validated through the Zod schema at module load. If the
 * hardcoded data ever drifts from the schema, this throws immediately with a
 * precise error — exactly the behavior we want at the DB/AI boundary too.
 */
export const sampleSite: Site = parseSite(lowcountryRedfish);
