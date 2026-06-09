import "dotenv/config";
import { keywordOverview, pickPrimaryKeyword } from "@/lib/ahrefs/research";

/**
 * Verify the Ahrefs integration end-to-end. Uses the key stored in admin (DB) or
 * the AHREFS_API_KEY env var. Run: npx tsx scripts/test-ahrefs.ts "seed keyword" ...
 */
async function main() {
  const seeds = process.argv.slice(2);
  const keywords = seeds.length
    ? seeds
    : ["south holston river fishing guide", "fly fishing boone nc", "watauga river fishing guide"];

  console.log("Looking up:", keywords);
  const rows = await keywordOverview(keywords, "us");
  for (const r of rows) {
    const cpc = r.cpc != null ? `$${(r.cpc / 100).toFixed(2)}` : "?";
    console.log(`  ${r.keyword} — vol ${r.volume ?? "?"} · KD ${r.difficulty ?? "?"} · cpc ${cpc}`);
  }
  const primary = pickPrimaryKeyword(rows, 0);
  console.log(`\nPicked primary: ${primary?.keyword} (vol ${primary?.volume}, KD ${primary?.difficulty})`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Ahrefs test failed:", (e as Error).message);
    process.exit(1);
  });
