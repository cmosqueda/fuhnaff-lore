// can be extended
export type LoreCardType = "character" | "place";

export interface BaseLoreCard {
  name: string;
  category: LoreCardType;
  image?: string;
  shortDescription: string;
  longDescription?: string;
}

// Character-specific
export interface CharacterData extends BaseLoreCard {
  category: "character";
  game: string;
  type: string;
}

// Place-specific
export interface PlaceData extends BaseLoreCard {
  category: "place";
  location: string;
}

// Event-specific
// export interface EventData extends BaseLoreCard {
//   type: "event";
//   year: number;
// }

// Union of all card types
export type LoreCardData = CharacterData | PlaceData;
