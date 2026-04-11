import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={!hasPrevPage}
        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border ${p === page ? "bg-primary-600 text-white" : "hover:bg-gray-100"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}
        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100">Next</button>
    </div>
  );
};

export default Pagination;
