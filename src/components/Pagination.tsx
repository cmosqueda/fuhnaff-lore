type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-3 py-6 font-mono text-xs">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="glitch-self px-3 py-1.5 bg-panel-raised border border-hairline hover:border-marquee text-parchment rounded-sm disabled:opacity-30 uppercase tracking-wide"
      >
        Prev
      </button>

      <span className="text-muted tabular-nums">
        {String(currentPage).padStart(2, "0")} / {String(totalPages || 1).padStart(2, "0")}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="glitch-self px-3 py-1.5 bg-panel-raised border border-hairline hover:border-marquee text-parchment rounded-sm disabled:opacity-30 uppercase tracking-wide"
      >
        Next
      </button>
    </div>
  );
}
