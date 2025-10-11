import { getBuku } from "@/Services/Buku/Buku.services";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RelateBook = ({ kategori, currentId }) => {
  const { type } = useParams();
  const [relateBooks, setRelateBooks] = useState([]);
  const navigate = useNavigate();

  const fetchRelate = async () => {
    try {
      const response = await getBuku(
        `${type}?kategori=${kategori}&page=1&limit=9`
      );

      const allBooks = response.data?.data || [];
      const filteredBooks = allBooks.filter((book) => book.id !== currentId);
      setRelateBooks(filteredBooks);
    } catch (error) {
      console.error("Gagal ambil buku terkait:", error);
    }
  };

  useEffect(() => {
    if (kategori) fetchRelate();
  }, [kategori]);

  if (relateBooks.length === 0) return null;

  return (
    <div className="md:mt-14 mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-600 pb-2">
        📚 Buku {kategori} Lainnya
      </h2>

      {/* 🔹 Gunakan grid biar lebih rapi */}
      <div
        className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          gap-4
        "
      >
        {relateBooks.map((book) => (
          <div
            key={book.id}
            onClick={() =>
              navigate(
                `/detail/${type}/${book.id}/${book.judul
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`
              )
            }
            className="
           
              rounded-xl 
            
              hover:shadow-lg 
              transition-all 
              cursor-pointer 
              md:p-4
              flex 
              flex-col 
              items-center
            "
          >
            <img
              src={
                book.cover ||
                "https://via.placeholder.com/150x220?text=No+Cover"
              }
              alt={book.judul}
              className="rounded-lg w-40 h-56  mb-3"
            />
            <div className="text-center">
              <p className="text-sm text-gray-500 mt-1">{book.penulis}</p>
              <h3 className="font-semibold text-gray-800 line-clamp-2">
                {book.judul}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelateBook;
