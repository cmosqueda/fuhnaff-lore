// Config for auto-discovering lore pages from the wiki's own categories,
// instead of hand-listing every title.
//
// Character/place scope covers the mainline FNAF games (1-4, FFPS, Sister
// Location, Security Breach, UCN, Help Wanted 1-2) via the wiki's per-game
// categories, which all follow a "{GameAbbr}: Bots" / "{GameAbbr}:
// Locations" naming convention. FNaF World is deliberately left out for now
// — it's a separate RPG spin-off with its own large, differently-scoped
// cast; add "FNaF World: Characters" here later if you want it included.
// Movies/books/games pull from their own top-level categories since those
// aren't broken out per-game the same way.
const CORE_GAMES = ["FNaF1", "FNaF2", "FNaF3", "FNaF4", "FFPS", "FNaF SL", "FNaF SB", "UCN", "FNaF HW", "FNaF HW2"];
export const characterCategories = CORE_GAMES.map((g) => `${g}: Bots`);
export const placeCategories = CORE_GAMES.map((g) => `${g}: Locations`);
export const movieCategories = ["Films"];
export const bookCategories = ["Books"];
export const gameCategories = ["FNAF: Video Games"];

// Per-title tweaks for cases the wiki's own title/fields don't render the
// way we want on a card. Keyed by the wiki page title (not the display name).
export const characterOverrides = {
  "Balloon Boy": { displayName: "Balloon Boy (BB)" },
};

export const placeOverrides = {
  "The Office": { displayName: "Security Office - FNaF 1" },
};

export const movieOverrides = {};
export const bookOverrides = {};
export const gameOverrides = {};

// Pages that slip through the "has an infobox with the required fields"
// filter but aren't actually the kind of entry we want on a card (rare —
// use this as an escape hatch when one shows up).
export const characterExclude = [];
export const placeExclude = [
  "Freddy Fazbear's Pizza", // the whole restaurant chain/establishment, not a room
  "Freddy Fazbear's Pizza (FNaF2)", // same, for the FNaF2 location
  "Party Rooms (TWB)", // from a spinoff short story, not the FNaF1/2 games
];
export const movieExclude = [];
export const bookExclude = [];
export const gameExclude = [];

// Title patterns to drop wholesale — demos, ports, bundles, box sets, etc.
// that technically have a matching infobox but aren't a distinct work.
export const bookExcludePatterns = [/box set/i, /collection/i, /sticker album/i, /encyclopedia/i, /survival logbook/i];
export const gameExcludePatterns = [
  /\(demo\)/i,
  /\(beta\)/i,
  /\(alpha\)/i,
  /\(troll game\)/i,
  /\(prototype\)/i,
  /bundle/i,
  /console (bundles|ports)/i,
  /collector's edition/i,
];
export const movieExcludePatterns = [/collection/i, /collector's edition/i, /\(film series\)/i];
