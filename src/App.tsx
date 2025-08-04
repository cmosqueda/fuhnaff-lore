import { useState, useEffect } from "react";
import { characters } from "./data/characters";
import { places } from "./data/places";
import type { LoreCardData } from "./types/lore";
import HeaderMenu from "./components/HeaderMenu";
import CardGrid from "./components/CardGrid";
import CardModal from "./components/CardModal";
// import CardFullView from "./components/CardFullView";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";

const categoryOptions = ["characters", "places"];
const categoryMap: Record<string, LoreCardData[]> = { characters, places };

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem("selectedCategory") || "characters";
  });

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  const filteredCards = categoryMap[selectedCategory] || [];

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => setCurrentPage(1), [selectedCategory]);

  const itemsPerPage = 16;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const isModalOpen = selectedCardIndex !== null;

  return (
    <div className="w-full h-full bg-zinc-900">
      {/* header menu */}
      <HeaderMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        options={categoryOptions}
      />

      {/* card grid */}
      <CardGrid cards={paginatedCards} onCardClick={(index) => setSelectedCardIndex(startIndex + index)} />

      {isModalOpen && selectedCardIndex !== null && (
        <CardModal
          isOpen={true}
          card={filteredCards[selectedCardIndex]}
          onClose={() => setSelectedCardIndex(null)}
          onPrev={() => setSelectedCardIndex((i) => (i !== null ? i - 1 : i))}
          onNext={() => setSelectedCardIndex((i) => (i !== null ? i + 1 : i))}
          isFirst={selectedCardIndex === 0}
          isLast={selectedCardIndex === filteredCards.length - 1}
        />
      )}

      {/* {selectedCardIndex !== null && (
        <CardFullView
          card={filteredCards[selectedCardIndex]}
          onBack={() => setSelectedCardIndex(null)}
          onPrev={() => setSelectedCardIndex((i) => (i !== null ? i - 1 : i))}
          onNext={() => setSelectedCardIndex((i) => (i !== null ? i + 1 : i))}
          isFirst={selectedCardIndex === 0}
          isLast={selectedCardIndex === filteredCards.length - 1}
        />
      )} */}

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />

      {/* footer */}
      <Footer />
    </div>
  );
}

export default App;
