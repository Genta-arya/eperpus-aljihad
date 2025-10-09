import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ pagination, onChange }) => {
  const { page = 1, limit = 10, totalPages = 1, total = 0 } = pagination;

  const handlePrev = () => {
    if (page > 1) onChange({ page: page - 1, limit });
  };

  const handleNext = () => {
    if (page < totalPages) onChange({ page: page + 1, limit });
  };

  const handleLimitChange = (e) => {
    onChange({ page: 1, limit: Number(e.target.value) });
  };

  return (
    <div className="flex flex-wrap items-center justify-between mt-4 border-t pt-3 pb-12 ">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Tampilkan</span>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="border rounded-md px-2 py-1 focus:outline-none"
        >
          {[10, 50, 100].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>/ data</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={page <= 1}
          className={`p-2 rounded-full border ${
            page <= 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <FaChevronLeft size={14} />
        </button>

        <span className="text-sm text-gray-700">
          <strong>{page}</strong> dari <strong>{totalPages}</strong>
        </span>

        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          className={`p-2 rounded-full border ${
            page >= totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
