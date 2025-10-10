import React, { useState } from "react";
import { FaBook, FaTabletAlt, FaSearch, FaTimes } from "react-icons/fa";
import bukufisik from "../../../assets/bukufisik.png";
import bukudigital from "../../../assets/bukudigital.png";
import PustakaKategori from "../View/PustakaKategori";
import { useNavigate } from "react-router-dom";

const MenuHomePage = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // 🔹 Hapus input
  const handleClear = () => {
    setSearchText("");
  };

  // 🔹 Jalankan pencarian (klik tombol / tekan enter)
  const handleSearch = (e) => {
    e.preventDefault(); // biar form ga reload
    if (searchText.trim() !== "") {
      //  navigasikan
      window.location.href = `/katalog/buku?q=${encodeURIComponent(
        searchText
      )}`;
    }
  };

  return (
    <div className="lg:max-w-[85%] md:max-w-[90%] w-full md:-mt-5 -mt-44 z-10 mx-auto">
      <div className="bg-white shadow-lg lg:p-10 py-4 px-2 border border-gray-100">
        {/* 🔸 Kategori */}
        <PustakaKategori />

        {/* 🔸 Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Cari buku..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e);
              }}
            />

            {/* Tombol Clear */}
            {searchText && (
              <FaTimes
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer transition"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all flex items-center gap-2"
          >
            <FaSearch className="text-white text-lg" />
            Cari
          </button>
        </form>

        {/* 🔸 Tombol Buku & E-Buku */}
        <div className="grid grid-cols-2 gap-2 uppercase">
          <button
            onClick={() => (window.location.href = "/katalog/buku")}
            className="flex flex-col hover:border-yellow-400 border-4 border-gray-100 items-center justify-center text-black py-4 rounded-xl font-semibold shadow hover:bg-gray-200 transition-all"
          >
            <div>
              <img
                src={bukufisik}
                alt="Pustaka Fisik"
                className="md:w-72 w-40 h-40 md:h-52"
              />
              <p className="uppercase font-bold">Pustaka Fisik</p>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/katalog/ebuku")}
            className="flex flex-col hover:border-yellow-400 border-4 border-gray-100 items-center justify-center text-black py-4 rounded-xl font-semibold shadow hover:bg-gray-200 transition-all"
          >
            <div className="flex flex-col items-center">
              <img
                src={bukudigital}
                alt="Pustaka Digital"
                className="md:w-72 w-40 h-40 md:h-52"
              />
              <p className="uppercase font-bold">Pustaka Digital</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuHomePage;
