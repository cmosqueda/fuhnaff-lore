// Auto-discovers lore pages (characters, places, movies, books, games) from
// the FNAF Fandom wiki's own categories and extracts structured data from
// each page's rendered Portable Infobox (Fandom's infobox extension) —
// reliable regardless of which underlying wikitext template built it. Used
// by both the build-time script (scripts/fetch-lore.mjs) and the live API
// route (api/lore.js).
//
// Content pulled here is CC BY-SA per Fandom's licensing terms
// (https://www.fandom.com/licensing) — the site attributes this in its footer.
import * as cheerio from "cheerio";

const WIKI = "https://freddy-fazbears-pizza.fandom.com";
const USER_AGENT = "fnaf-cards-lore-fetch/1.0 (github.com/cmosqueda/fuhnaff-lore)";

// Maps the wiki's per-game category prefixes (e.g. "Category:FNaF2: Bots")
// to a readable game label. Unrecognized prefixes fall back to the raw
// prefix text, so new games/series still show up, just less prettified
// until added here.
const GAME_LABELS = {
  "Five Nights at Freddy's": "FNaF 1",
  FNaF1: "FNaF 1",
  FNaF2: "FNaF 2",
  FNaF3: "FNaF 3",
  FNaF4: "FNaF 4",
  FFPS: "FFPS",
  "FNaF SL": "Sister Location",
  "FNaF World": "FNaF World",
  UCN: "Ultimate Custom Night",
  "FNaF HW": "Help Wanted",
  "FNaF HW2": "Help Wanted 2",
  "FNaF AR": "AR: Special Delivery",
  "FNaF SB": "Security Breach",
  "FNaF SotM": "Secret of the Mimic",
  "FNaF ItP": "Into the Pit",
  "FNaF Film": "Movie",
  "Novel Trilogy": "Novel Trilogy",
  "Fazbear Frights": "Fazbear Frights",
};

async function wikiFetch(params) {
  const url = `${WIKI}/api.php?${new URLSearchParams({ format: "json", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`${url} -> ${data.error.info}`);
  return data;
}

async function fetchCategoryMembers(category) {
  const data = await wikiFetch({
    action: "query",
    list: "categorymembers",
    cmtitle: `Category:${category}`,
    cmlimit: "500",
    cmnamespace: "0",
  });
  return data.query.categorymembers.map((m) => m.title);
}

async function fetchParsedPage(title) {
  const data = await wikiFetch({ action: "parse", page: title, prop: "text", redirects: "1" });
  return { title: data.parse.title, html: data.parse.text["*"] };
}

async function fetchPageCategories(title) {
  const data = await wikiFetch({ action: "query", titles: title, redirects: "1", prop: "categories", cllimit: "500" });
  const page = Object.values(data.query.pages)[0];
  return (page?.categories ?? []).map((c) => c.title.replace(/^Category:/, ""));
}

// MediaWiki's own "page image" pick (via the PageImages extension) is far
// more consistent than grabbing the first image out of an infobox gallery,
// which can land on an arbitrary pose rather than the canonical render.
async function fetchPageImage(title) {
  const data = await wikiFetch({ action: "query", titles: title, redirects: "1", prop: "pageimages", piprop: "original" });
  const page = Object.values(data.query.pages)[0];
  return page?.original?.source ?? "";
}

// Umbrella/meta category prefixes that technically match the "X: Bots"
// pattern but aren't an actual game — filtered out of appearsIn entirely.
const NON_GAME_PREFIXES = new Set(["Core FNaF Series", "Core Series"]);

// Turns a page's raw category tags into a de-duplicated, readable list of
// games it's associated with, e.g. ["FNaF1: Bots", "FNaF2: Bots"] -> ["FNaF 1", "FNaF 2"].
function deriveAppearsIn(categories) {
  const labels = new Set();
  for (const cat of categories) {
    const match = cat.match(/^(.+?):\s*(Bots|Characters|Locations)$/);
    if (match && !NON_GAME_PREFIXES.has(match[1])) labels.add(GAME_LABELS[match[1]] ?? match[1]);
  }
  return [...labels];
}

// Reads every `data-source` field out of the page's Portable Infobox
// (works the same whether the underlying template is Infobox Bot, Location,
// or a bespoke per-page wrapper template — Fandom renders them identically).
function readInfobox($) {
  const infobox = $("aside.portable-infobox").first();
  if (infobox.length === 0) return null;

  const fields = {};
  infobox.find("[data-source]").each((_, el) => {
    const key = $(el).attr("data-source");
    const valueEl = $(el).find(".pi-data-value").first();
    const target = valueEl.length ? valueEl : $(el);
    target.find("br").replaceWith(", ");
    const text = target
      .text()
      .trim()
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s+/g, " ");
    if (key && text) fields[key] = text;
  });

  return { fields };
}

// Pulls the first real prose paragraph, skipping the infobox, nav bars
// (e.g. "FNaF2 • FNaF SL • UCN"), and other boilerplate.
function extractDescription($) {
  $("aside.portable-infobox, table, .mw-empty-elt, dl, sup.reference").remove();
  $('[class*="quick-answer"], [class^="trfc"]').remove();

  let description = "";
  $(".mw-parser-output")
    .first()
    .children("p")
    .each((_, el) => {
      if (description) return;
      const text = $(el).text().trim().replace(/\s+/g, " ");
      const wordCount = text.split(" ").filter(Boolean).length;
      if (wordCount >= 8 && !text.includes("•")) description = text;
    });
  return description;
}

function normalizeGame(debutText) {
  if (!debutText) return "Unknown";
  const match = debutText.match(/Five Nights at Freddy's\s*(\d*)$/);
  if (match) return match[1] ? `FNaF ${match[1]}` : "FNaF 1";
  return debutText;
}

function cleanLocation(locationText) {
  return locationText.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

// Fetches candidate pages for `categories`, drops anything whose title
// matches `excludePatterns` or is in `exclude`, then filters to pages whose
// infobox has every field in `requiredFields` — that's what separates a
// real subject page from a group/overview article (e.g. "Classic
// Animatronics") or, for games/books, noise like demos and bundles.
async function discoverPages({ categories, exclude, excludePatterns, requiredFields, withAppearsIn }) {
  const titleSets = await Promise.all(categories.map(fetchCategoryMembers));
  const titles = [...new Set(titleSets.flat())].filter(
    (t) => !exclude.includes(t) && !(excludePatterns ?? []).some((re) => re.test(t))
  );

  const pages = await Promise.all(
    titles.map(async (title) => {
      const [{ title: resolvedTitle, html }, pageCategories, image] = await Promise.all([
        fetchParsedPage(title),
        withAppearsIn ? fetchPageCategories(title) : Promise.resolve([]),
        fetchPageImage(title),
      ]);
      const $ = cheerio.load(html);
      const infobox = readInfobox($);
      if (!infobox || !requiredFields.every((field) => infobox.fields[field])) return null;
      return { title: resolvedTitle, $, infobox, image, appearsIn: deriveAppearsIn(pageCategories) };
    })
  );

  return pages.filter(Boolean);
}

function applyOverride(title, overrides) {
  return overrides[title] ?? {};
}

export async function discoverCharacters(categories, overrides, exclude) {
  const pages = await discoverPages({ categories, exclude, requiredFields: ["debut"], withAppearsIn: true });
  return pages.map(({ title, $, infobox, image, appearsIn }) => {
    const override = applyOverride(title, overrides);
    return {
      name: override.displayName ?? title,
      category: "character",
      game: normalizeGame(infobox.fields.debut),
      type: "animatronic",
      appearsIn,
      image,
      shortDescription: extractDescription($) || "(no description found)",
    };
  });
}

export async function discoverPlaces(categories, overrides, exclude) {
  const pages = await discoverPages({ categories, exclude, requiredFields: ["debut"], withAppearsIn: true });
  return pages.map(({ title, $, infobox, image, appearsIn }) => {
    const override = applyOverride(title, overrides);
    return {
      name: override.displayName ?? title,
      category: "place",
      location: infobox.fields.location ? cleanLocation(infobox.fields.location) : "Unknown",
      appearsIn,
      image,
      shortDescription: extractDescription($) || "(no description found)",
    };
  });
}

export async function discoverMovies(categories, overrides, exclude, excludePatterns) {
  const pages = await discoverPages({
    categories,
    exclude,
    excludePatterns,
    requiredFields: ["release_date", "directed_by"],
    withAppearsIn: false,
  });
  return pages.map(({ title, $, infobox, image }) => {
    const override = applyOverride(title, overrides);
    return {
      name: override.displayName ?? infobox.fields.title1 ?? title,
      category: "movie",
      releaseDate: infobox.fields.release_date,
      image,
      shortDescription: extractDescription($) || "(no description found)",
    };
  });
}

export async function discoverBooks(categories, overrides, exclude, excludePatterns) {
  const pages = await discoverPages({
    categories,
    exclude,
    excludePatterns,
    requiredFields: ["release", "author"],
    withAppearsIn: false,
  });
  return pages.map(({ title, $, infobox, image }) => {
    const override = applyOverride(title, overrides);
    return {
      name: override.displayName ?? title,
      category: "book",
      author: infobox.fields.author,
      image,
      shortDescription: extractDescription($) || "(no description found)",
    };
  });
}

export async function discoverGames(categories, overrides, exclude, excludePatterns) {
  const pages = await discoverPages({
    categories,
    exclude,
    excludePatterns,
    requiredFields: ["release", "dev"],
    withAppearsIn: false,
  });
  return pages.map(({ title, $, infobox, image }) => {
    const override = applyOverride(title, overrides);
    return {
      name: override.displayName ?? title,
      category: "game",
      releaseDate: infobox.fields.release,
      image,
      shortDescription: extractDescription($) || "(no description found)",
    };
  });
}

export async function fetchLoreData(config) {
  const [characters, places, movies, books, games] = await Promise.all([
    discoverCharacters(config.characterCategories, config.characterOverrides ?? {}, config.characterExclude ?? []),
    discoverPlaces(config.placeCategories, config.placeOverrides ?? {}, config.placeExclude ?? []),
    discoverMovies(
      config.movieCategories,
      config.movieOverrides ?? {},
      config.movieExclude ?? [],
      config.movieExcludePatterns
    ),
    discoverBooks(config.bookCategories, config.bookOverrides ?? {}, config.bookExclude ?? [], config.bookExcludePatterns),
    discoverGames(config.gameCategories, config.gameOverrides ?? {}, config.gameExclude ?? [], config.gameExcludePatterns),
  ]);
  return { characters, places, movies, books, games };
}
