import { getBuku } from "@/Services/Buku/Buku.services";
import React, { useState, useEffect } from "react";
import { FaImage, FaRedo } from "react-icons/fa";

const PustakaSpoiler = () => {
  const [bukus, setBukus] = useState([]);
  const [ebukus, setEbukus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imgError, setImgError] = useState(false);
  const fetchBuku = async () => {
    try {
      setLoading(true);
      const bukuData = await getBuku("buku?page=1&limit=4");
      const ebukuData = await getBuku("ebuku?page=1&limit=4");
      setBukus(bukuData?.data.data || []);
      setEbukus(ebukuData?.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuku();
  }, []);

  // Skeleton card
  const SkeletonCard = () => (
    <div className="w-full h-72  border rounded-md overflow-hidden  animate-pulse">
      <div className="w-96 h-40  bg-gray-300"></div>
      <div className="p-2 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );

  const ImagePlaceholder = () => (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-md shadow-lg border border-gray-300">
      <FaImage className="text-gray-400 text-6xl mb-2" />
      <span className="text-gray-500 font-medium">Gagal memuat gambar</span>
    </div>
  );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FaImage className="text-gray-400 text-8xl mb-4" />
        <p className="text-gray-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => {
            fetchBuku(), setImgError(false), setError(null);
          }}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <FaRedo className="mr-2" />
          Coba lagi
        </button>
      </div>
    );

  return (
    <div className="px-3 md:px-24 md:mt-20 mt-10">
      {/* Buku Fisik */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">PUSTAKA TERBARU</h2>
          <p className="cursor-pointer font-semibold hover:underline">
            Lihat semua
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : bukus.length > 0 ? (
            bukus.map((buku) => (
              <div key={buku.id} className="flex flex-col w-full">
                {imgError && <ImagePlaceholder />}
                {!imgError && (
                  <img
                    src={buku.cover}
                    onError={() => setImgError(true)}
                    alt={buku.judul}
                    className="w-full mb-4 rounded-md shadow-xl drop-shadow-lg hover:scale-95 duration-300 shadow-black"
                  />
                )}
                <div className="p-2 flex flex-col flex-1">
                  <p className="text-xs text-center mb-2 uppercase md:text-sm text-gray-500 truncate">
                    {buku.penulis.length > 30
                      ? buku.penulis.slice(0, 30) + "..."
                      : buku.penulis}
                  </p>
                  <h3 className="font-semibold text-center text-sm md:text-lg truncate">
                    {buku.judul.length > 40
                      ? buku.judul.slice(0, 40) + "..."
                      : buku.judul}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada buku fisik</p>
          )}
        </div>
      </div>

      {/* E-Buku */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">PUSTAKA DIGITAL</h2>
          <p className="cursor-pointer font-semibold hover:underline">
            Lihat semua
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : ebukus.length > 0 ? (
            ebukus.map((ebuku) => (
              <div
                key={ebuku.id}
                className="flex flex-col w-full cursor-pointer"
                onClick={() => window.open(ebuku.file, "_blank")}
              >
                {imgError && <ImagePlaceholder />}
                {!imgError && (
                  <img
                    src={ebuku.cover}
                    onError={() => setImgError(true)}
                    alt={ebuku.judul}
                    className="w-full mb-4 rounded-md shadow-xl drop-shadow-lg hover:scale-95 duration-300 shadow-black"
                  />
                )}

                <div className="p-2 flex flex-col flex-1">
                  <p className="text-xs text-center mb-2 uppercase md:text-sm text-gray-500 truncate">
                    {ebuku.penulis.length > 30
                      ? ebuku.penulis.slice(0, 30) + "..."
                      : ebuku.penulis}
                  </p>
                  <h3 className="font-semibold text-center text-sm md:text-lg truncate">
                    {ebuku.judul.length > 40
                      ? ebuku.judul.slice(0, 40) + "..."
                      : ebuku.judul}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada e-buku</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PustakaSpoiler;
