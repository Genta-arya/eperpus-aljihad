import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { SearchIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Search = ({
  searchKeyword,
  setSearchKeyword,
  handleSearch,
  pagination,
  fetchBuku,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Ambil query params saat pertama kali buka halaman
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const fetch = params.get("fetch");

    if (q) {
      setSearchKeyword(q);
      // jika ada param fetch=true maka jalankan pencarian otomatis
      if (fetch === "true") {
        handleSearch(1, pagination.limit, q);
      }
    }
  }, [location.search]);

  // 🔹 Tombol hapus (clear)
  const handleClear = () => {
    setSearchKeyword("");
    const params = new URLSearchParams(location.search);
    params.delete("q");
    params.delete("fetch");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    fetchBuku(1, pagination.limit);
  };

  // 🔹 Jalankan pencarian
  const executeSearch = () => {
    const params = new URLSearchParams(location.search);
    if (searchKeyword.trim()) {
      params.set("q", searchKeyword.trim());
      params.delete("fetch"); // hapus fetch agar tidak auto jalan terus
    } else {
      params.delete("q");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    handleSearch(1, pagination.limit, searchKeyword);
  };

  // 🔹 Tekan Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-4 items-center">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Cari judul atau penulis..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full outline-none pr-8"
        />
        {searchKeyword && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <button
        onClick={executeSearch}
        className="border text-black px-4 py-2 rounded-lg transition flex-shrink-0"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default Search;
