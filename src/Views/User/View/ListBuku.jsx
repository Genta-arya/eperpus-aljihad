import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getBuku, searchBooks } from "@/Services/Buku/Buku.services";
import { getKategori } from "@/Services/Kategori/Kategori.services";
import { getLembaga } from "@/Services/Lembaga/Lembaga.services";
import NavigationBack from "../components/NavigationBack";
import Pagination from "@/components/Pagination";
import GridBuku from "./GridBuku";
import Filter from "./Filter";
import Search from "./Search";
import Footer from "../components/Footer";
import Notfound from "./Notfound";

const ListBuku = () => {
  const location = useLocation();
  const path = location.pathname;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [kategori, setKategori] = useState("");
  const [unitPendidikan, setUnitPendidikan] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  // 🔹 Fetch kategori
  const fetchKategori = async () => {
    try {
      const res = await getKategori();
      setKategoriList(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch unit pendidikan
  const fetchUnit = async () => {
    try {
      const res = await getLembaga();
      setUnitList(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Buku Default
  const fetchBuku = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(location.search);
      const kategoriParam = params.get("kategori") || kategori;
      const unitParam = params.get("unitPendidikan") || unitPendidikan;

      const p = new URLSearchParams({ page, limit });
      if (kategoriParam) p.append("kategori", kategoriParam);
      if (unitParam) p.append("unitPendidikan", unitParam);

      const endpoint = path.includes("/katalog/buku")
        ? `buku?${p.toString()}`
        : `ebuku?${p.toString()}`;

      const res = await getBuku(endpoint);
      const result = res?.data?.data || [];
      setData(result);
      setPagination(
        res?.data?.pagination || { page, limit, totalPages: 1, total: 0 }
      );
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("404");
      } else {
        setError("gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search Buku
  const handleSearch = async (
    page = 1,
    limit = 10,
    keyword = searchKeyword
  ) => {
    if (!keyword.trim()) {
      setSubmittedKeyword("");
      fetchBuku(1, limit);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const jenis = path.includes("/katalog/buku") ? "buku" : "ebuku";

      const res = await searchBooks({
        keyword,
        page,
        limit,
        type: jenis,
        kategori,
        unitPendidikan,
      });

      const result = res?.data;
      setData(result?.ebook || []);
      setPagination(result?.pagination || pagination);
      setSubmittedKeyword(keyword);
    } catch (err) {
      console.error(err.response.status);
      if (err?.response?.status === 404) {
        setError("404");
      } else {
        setError("gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const kategoriParam = params.get("kategori") || "";
    const unitParam = params.get("unitPendidikan") || "";

    // set state dari URL
    setKategori(kategoriParam);
    setUnitPendidikan(unitParam);
    setSearchKeyword(q);

    // Kondisi: kalau ada keyword, pakai searchBooks
    if (q.trim()) {
      handleSearch(1, pagination.limit, q);
    } else {
      // Kalau gak ada keyword, tetap fetchBuku dengan kategori/unitPendidikan
      fetchBuku(1, pagination.limit);
    }
  }, [location.search]);

  // 🔹 Pagination
  const handlePageChange = ({ page, limit }) => {
    setPagination((prev) => ({ ...prev, page, limit }));

    if (submittedKeyword.trim()) {
      // kalau ada search keyword, pakai handleSearch
      handleSearch(page, limit, submittedKeyword);
    } else {
      // kalau tidak, fetch data normal
      fetchBuku(page, limit);
    }
  };

  // 🔹 Fetch kategori & unit pendidikan awal
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchKategori();
    fetchUnit();
  }, []);

  const title = path.includes("/katalog/buku")
    ? "PUSTAKA BUKU"
    : path.includes("/katalog/ebuku")
    ? "PUSTAKA DIGITAL"
    : "PUSTAKA";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBack titles={title} />

      <div className="p-2 md:p-8 max-w-8xl mx-auto">
        <Search
          handleSearch={handleSearch}
          pagination={pagination}
          fetchBuku={fetchBuku}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />

        <Filter
          kategori={kategori}
          kategoriList={kategoriList}
          setKategori={setKategori}
          setUnitPendidikan={setUnitPendidikan}
          unitList={unitList}
          unitPendidikan={unitPendidikan}
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse h-64 rounded-lg"
                ></div>
              ))}
          </div>
        ) : error ? (
          <>
            <Notfound errormessage={error} />
          </>
        ) : (
          <>
            <GridBuku data={data} path={path} />
            <Pagination pagination={pagination} onChange={handlePageChange} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ListBuku;
