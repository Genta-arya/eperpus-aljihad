import { getKategori } from "@/Services/Kategori/Kategori.services";
import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PustakaKategori = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRandomColor = () => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400",
      "bg-orange-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setLoading(true);
        const response = await getKategori();
        setKategoriList(response?.data || []);
      } catch (error) {
        console.error("Gagal memuat kategori", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKategori();
  }, []);

  const SkeletonItem = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse mb-2"></div>
      <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );

  // 🔹 Handle klik kategori → buka halaman katalog buku dengan params
  const handleClick = (kategoriName) => {
    navigate(`/katalog/buku?kategori=${encodeURIComponent(kategoriName)}`);
  };

  return (
    <div className="overflow-x-auto py-4 px-2 mb-8">
      <div className="flex space-x-4">
        {loading
          ? Array(12)
              .fill(0)
              .map((_, i) => <SkeletonItem key={i} />)
          : kategoriList.map((kategori) => (
              <div
                className="flex flex-col items-center w-20 cursor-pointer"
                key={kategori.id}
                onClick={() => handleClick(kategori.name)}
              >
                <div
                  className={`w-16 h-16 flex items-center border-2 border-gray-500 justify-center rounded-full ${getRandomColor()} text-white shadow-lg hover:scale-105 transition`}
                >
                  <FaBook className="text-2xl" />
                </div>
                <div className="text-xs text-center mt-1 px-1 line-clamp-3">
                  {kategori.name}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PustakaKategori;
