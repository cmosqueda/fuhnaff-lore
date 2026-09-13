// Config for auto-discovering lore pages from the wiki's own categories,
// instead of hand-listing every title.
//
// Character/place scope is intentionally limited to FNaF 1 + FNaF 2
// (matching what this site has always covered) via the wiki's per-game
// categories. Movies/books/games pull from their own top-level categories
// since those aren't broken out per-game the same way. Expanding scope
// later just means adding more category names below.
export const characterCategories = ["FNaF1: Bots", "FNaF2: Bots"];
export const placeCategories = ["FNaF1: Locations", "FNaF2: Locations"];
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
