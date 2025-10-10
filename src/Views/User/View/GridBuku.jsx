import React from "react";

const GridBuku = ({ data }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:gap-6 gap-2">
      {data.map((item) => (
        <div key={item.id} className="">
          <div className="">
            <img
              src={
                item.cover ||
                "https://via.placeholder.com/200x300?text=No+Cover"
              }
              alt={item.judul || "Tanpa Judul"}
              className="w-full h-full  group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 text-center">
            <p className="text-xs text-gray-500 mt-1">
              {item.penulis || "Tidak diketahui"}
            </p>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
              {item.judul || "Tanpa Judul"}
            </h3>
          </div>

          {/* Efek overlay saat hover */}
        </div>
      ))}
    </div>
  );
};

export default GridBuku;
