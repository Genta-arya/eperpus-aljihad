import React, { useState } from "react";
import { FaBook, FaTabletAlt, FaSearch, FaTimes } from "react-icons/fa";

const MenuHomePage = () => {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className="lg:max-w-[60%] w-full -mt-20 z-10 mx-auto px-4">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-xl lg:p-10 p-6 border border-gray-100">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Cari buku..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 transition-all"
            />

            {/* Tombol Clear */}
            {searchText && (
              <FaTimes
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer transition"
              />
            )}
          </div>
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all flex items-center gap-2">
            <FaSearch className="text-white text-lg" />
            Cari
          </button>
        </div>

        {/* Tombol Buku dan E-Buku */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col border-yellow-400 border-4 items-center justify-center bg-green-700 text-white py-4 rounded-xl font-semibold shadow hover:bg-green-800 transition-all">
            <FaBook className="text-6xl mb-3" />
            Buku
          </button>

          <button className="flex flex-col items-center border-yellow-400 border-4 justify-center bg-green-700 text-white py-4 rounded-xl font-semibold shadow hover:bg-green-800 transition-all">
            <FaTabletAlt className="text-6xl mb-3" />
            E-Buku
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuHomePage;
