import { responseHandler } from "@/lib/utils";
import { getSingleBuku } from "@/Services/Buku/Buku.services";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBack from "../components/NavigationBack";
import {
  FaBook,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaBarcode,
  FaSearch,
} from "react-icons/fa";
import Loading from "@/components/Loading";
import Notfound from "./Notfound";
import Footer from "../components/Footer";
import RelateBook from "./RelateBook";

const DetailBuku = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id, type, name } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("no");
  const [keyword, setKeyword] = useState("");
  const [jenisSearch, setJenisSearch] = useState("buku"); // default ke buku

  const slugify = (text) => {
    if (!text) return "";
    return text
      .replace(/<[^>]+>/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
  };

  const fetchDetailBuku = async () => {
    setLoading(true);
    try {
      const response = await getSingleBuku(`${id}?jenis=${type}`);
      const buku = response.data;
      if (buku) {
        setData(buku);
        const slugJudul = slugify(buku.judul);
        if (name !== slugJudul) {
          navigate(`/detail/${type}/${id}/${slugJudul}`, { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.status === 404) setError("404");
      else setError("gagal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailBuku();
  }, [id, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // arahkan sesuai jenis
    window.location.href = `/katalog/${jenisSearch}?q=${encodeURIComponent(
      keyword.trim()
    )}`;
  };

  if (loading) return <Loading />;

  if (!data ) {
    return (
      <div>
        <NavigationBack titles="Detail Buku" />
        <div className="md:mt-20">
          <Notfound errormessage={error} />
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationBack titles="Detail Buku" />

      <div className=" p-2 md:p-8">
        {/* 🔍 Search Bar dengan Select */}
        <form
          onSubmit={handleSearch}
          className="w-full flex overflow-auto md:flex-row items-center gap-3 mb-6 bg-white shadow-lg rounded-full px-4 py-1 mt-4 md:mt-0 border border-gray-200"
        >
          {/* 🔍 Input Search */}
          <div className="flex items-center gap-2 flex-grow w-full">
            <input
              type="text"
              placeholder="Cari buku..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* 🔘 Select & Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <select
              value={jenisSearch}
              onChange={(e) => setJenisSearch(e.target.value)}
              className="border border-gray-300 text-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition w-full md:w-auto"
            >
              <option value="buku">📚 Buku</option>
              <option value="ebuku">💾 eBuku</option>
            </select>

            <button
              type="submit"
              className="border px-3 py-2 rounded-full transition font-medium "
            >
              <FaSearch className="text-black" />
            </button>
          </div>
        </form>

        {/* 📘 Detail Buku */}
        <div className="bg-white shadow-lg rounded-2xl  mt-6 md:flex">
          {/* Cover Buku */}
          <div className="md:w-1/3 w-full flex justify-center items-center bg-gray-100 p-6">
            <img
              src={
                data.cover ||
                "https://via.placeholder.com/200x300?text=No+Cover"
              }
              alt={data.judul}
              className="rounded-xl shadow-md w-64 h-auto object-cover cursor-pointer hover:shadow-2xl transition-all duration-300"
              onClick={() => window.open(data.cover, "_blank")}
            />
          </div>

          {/* Info Buku */}
          <div className="md:w-2/3 w-full p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {data.judul}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                {data.kategori?.name}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                {data.type?.name}
              </span>
            </div>

            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <FaUser className="text-blue-500" />
                <span>
                  <strong>Penulis:</strong> {data.penulis || "Tidak diketahui"}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <FaBuilding className="text-purple-500" />
                <span>
                  <strong>Penerbit:</strong> {data.penerbit}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-500" />
                <span>
                  <strong>Tahun:</strong> {data.tahun}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <FaBarcode className="text-pink-500" />
                <span>
                  <strong>ISBN:</strong> {data.isbn}
                </span>
              </p>
              {type === "buku" && (
                <p className="flex items-center gap-2">
                  <FaBook className="text-indigo-500" />
                  <span>
                    <strong>Lokasi Rak:</strong> {data.lokasirak}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 ">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Jumlah Halaman</p>
                <p className="text-xl font-semibold text-gray-800">
                  {data.halaman}
                </p>
              </div>

              {type === "buku" && (
                <div className="p-3 bg-gray-50 rounded-lg text-center ">
                  <p className="text-sm text-gray-500">Jumlah Buku</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {data.jumlah}
                  </p>
                </div>
              )}

              <div className={`p-3 bg-gray-50 rounded-lg text-center  ${type === "buku" ? "col-span-2 md:col-span-2" : "md:col-span-1"} `}>
                <p className="text-sm text-gray-500">Tanggal Tambah</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(data.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {type !== "buku" && (
              <div className="p-3 mt-4 bg-gray-50 rounded-lg text-center">
                <p
                  onClick={() => window.open(data.file, "_blank")}
                  className="text-sm text-white bg-green-700 py-2 px-4 rounded-full cursor-pointer hover:bg-green-600 transition"
                >
                  Lihat eBuku (PDF)
                </p>
              </div>
            )}
          </div>
        </div>

        <RelateBook kategori={data.kategori?.name} currentId={data.id} />
      </div>

      <Footer />
    </>
  );
};

export default DetailBuku;
