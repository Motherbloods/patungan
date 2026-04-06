import PropTypes from "prop-types";
import { groupCardShape } from "../../propTypes/memberPropTypes";
import { useSearchParams } from "react-router-dom";
import GroupCard from "./GroupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 4;

function GroupPagination({ groups, pagination }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = pagination.totalPages ?? 1;
  const totalItems = pagination.totalItems ?? groups.length;
  const page = Number.parseInt(searchParams.get("page"), 10) || 1;
  const start = (page - 1) * PAGE_SIZE;

  function goTo(n) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(n));
      return next;
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {groups.map((g) => (
          <GroupCard key={g._id} group={g} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            onClick={() => goTo(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-custom text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-tertiary active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1.5 sm:hidden">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                aria-label={`Go to page ${n}`}
                onClick={() => goTo(n)}
                className="transition-all duration-200"
                style={{
                  width: n === page ? 20 : 8,
                  height: 8,
                  borderRadius: 99,
                  background: n === page ? "#3B82F6" : "var(--color-border)",
                }}
              />
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goTo(i + 1)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  page === i + 1
                    ? "bg-blue-500 text-white"
                    : "text-secondary hover:bg-tertiary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-custom text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-tertiary active:scale-95"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-secondary">
        {start + 1}–{Math.min(start + PAGE_SIZE, totalItems)} dari {totalItems}{" "}
        grup
      </p>
    </>
  );
}

GroupPagination.propTypes = {
  groups: PropTypes.arrayOf(groupCardShape).isRequired,
  pagination: PropTypes.shape({
    totalPages: PropTypes.number,
    totalItems: PropTypes.number,
  }).isRequired,
};

export default GroupPagination;
