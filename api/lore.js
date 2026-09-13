// Vercel serverless function: GET /api/lore
// Auto-discovers lore data (characters, places, movies, books, games) from
// the FNAF Fandom wiki's own categories and caches it at the edge, so the
// wiki itself only gets hit roughly once a day regardless of visitor
// traffic (see Cache-Control below).
import * as manifest from "../lib/lore/manifest.mjs";
import { fetchLoreData } from "../lib/lore/wiki.mjs";

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
