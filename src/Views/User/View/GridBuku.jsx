import React from "react";
import { Link } from "react-router-dom";

const GridBuku = ({ data, path }) => {
  const slugify = (text) => {
    if (!text) return "";

    let cleanText = text.replace(/<[^>]+>/g, "");

    cleanText = cleanText.trim().replace(/\s+/g, "-");

    cleanText = cleanText.replace(/[^a-zA-Z0-9-]/g, "");

    return cleanText.toLowerCase();
  };
  const link = path === "/katalog/buku" ? "buku" : "ebuku";
  console.log(path);
  console.log(link);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-2">
      {data.map((item) => (
        <Link
          to={`/detail/${link}/${item.id}/${slugify(item.judul)}`}
          key={item.id}
          className=" cursor-pointer"
        >
          <div className="w-full h-96 border-2 bg-gray-200 overflow-hidden rounded-lg group">
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
        </Link>
      ))}
    </div>
  );
};

export default GridBuku;
