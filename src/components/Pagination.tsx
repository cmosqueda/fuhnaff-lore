type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 my-5">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-purple-800 text-white rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-white px-2">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-purple-800 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
