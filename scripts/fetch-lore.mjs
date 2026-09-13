// Regenerates src/data/*.ts by auto-discovering pages from the FNAF Fandom
// wiki's categories. Run with: npm run fetch:lore
//
// This is the build-time / fallback data path. The same discovery logic
// also powers the live api/lore.js serverless route used in production.
import { writeFile } from "node:fs/promises";
import * as manifest from "../lib/lore/manifest.mjs";
import { fetchLoreData } from "../lib/lore/wiki.mjs";

function formatArray(varName, typeName, importPath, entries, extraFields) {
  const lines = entries.map((e) => {
    const fields = [
      `    name: ${JSON.stringify(e.name)},`,
      `    category: ${JSON.stringify(e.category)},`,
      ...extraFields(e),
      `    appearsIn: ${JSON.stringify(e.appearsIn ?? [])},`,
      `    image: ${JSON.stringify(e.image ?? "")},`,
      `    shortDescription: ${JSON.stringify(e.shortDescription)},`,
    ];
    return `  {\n${fields.join("\n")}\n  },`;
  });
  return `import type { ${typeName} } from "@/types/lore";\n\nexport const ${varName}: ${typeName}[] = [\n${lines.join(
    "\n"
  )}\n];\n`;
}

async function main() {
  console.log("Discovering lore from the wiki's categories...");
  const { characters, places, movies, books, games } = await fetchLoreData(manifest);
  console.log(
    `Found ${characters.length} characters, ${places.length} places, ${movies.length} movies, ${books.length} books, ${games.length} games.`
  );

  const writers = [
    [
      "characters",
      formatArray("characters", "CharacterData", "", characters, (e) => [
        `    game: ${JSON.stringify(e.game)},`,
        `    type: ${JSON.stringify(e.type)},`,
      ]),
    ],
    [
      "places",
      formatArray("places", "PlaceData", "", places, (e) => [`    location: ${JSON.stringify(e.location)},`]),
    ],
    [
      "movies",
      formatArray("movies", "MovieData", "", movies, (e) => [`    releaseDate: ${JSON.stringify(e.releaseDate)},`]),
    ],
    ["books", formatArray("books", "BookData", "", books, (e) => [`    author: ${JSON.stringify(e.author)},`])],
    [
      "games",
      formatArray("games", "GameData", "", games, (e) => [`    releaseDate: ${JSON.stringify(e.releaseDate)},`]),
    ],
  ];

  for (const [name, source] of writers) {
    await writeFile(new URL(`../src/data/${name}.ts`, import.meta.url), source);
  }
  console.log(`Wrote ${writers.map(([name]) => `src/data/${name}.ts`).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
