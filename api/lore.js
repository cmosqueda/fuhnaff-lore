// Vercel serverless function: GET /api/lore
// Auto-discovers lore data (characters, places, movies, books, games) from
// the FNAF Fandom wiki's own categories and caches it at the edge, so the
// wiki itself only gets hit roughly once a day regardless of visitor
// traffic (see Cache-Control below).
import * as manifest from "../lib/lore/manifest.mjs";
import { fetchLoreData } from "../lib/lore/wiki.mjs";

// Discovering across 10 games' worth of categories means fetching several
// hundred wiki pages on a cache miss (~10s locally) — comfortably past
// Vercel's 10s default, so this asks for more room. stale-while-revalidate
// below means visitors essentially never wait on this: they get the cached
// response while a slow cache-refresh happens in the background.
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data = await fetchLoreData(manifest);
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch lore from the wiki" });
  }
}
