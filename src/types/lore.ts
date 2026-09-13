// can be extended
export type LoreCardType = "character" | "place" | "movie" | "book" | "game";

export interface BaseLoreCard {
  name: string;
  category: LoreCardType;
  image?: string;
  shortDescription: string;
  longDescription?: string;
  // Which FNAF games this entry is tied to (e.g. ["FNaF 1", "FNaF 2"]),
  // derived from the wiki's own category tags. Lets the UI cross-link and
  // filter lore by game regardless of category (character/place/movie/...).
  appearsIn?: string[];
}

// Character-specific
export interface CharacterData extends BaseLoreCard {
  category: "character";
  game: string; // debut game
  type: string;
}

// Place-specific
export interface PlaceData extends BaseLoreCard {
  category: "place";
  location: string;
}

// Movie-specific
export interface MovieData extends BaseLoreCard {
  category: "movie";
  releaseDate: string;
}

// Book-specific
export interface BookData extends BaseLoreCard {
  category: "book";
  author: string;
}

// Game-specific
export interface GameData extends BaseLoreCard {
  category: "game";
  releaseDate: string;
}

// Union of all card types
export type LoreCardData = CharacterData | PlaceData | MovieData | BookData | GameData;
