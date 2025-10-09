import React, { useEffect, useState } from "react";
import ContainerMenu from "@/components/ContainerMenu";

import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  tableBase,
  tableWrapper,
  tbodyClass,
  tdClass,
  thClass,
  theadClass,
  trHoverClass,
} from "@/Constant/TableSyles";
import {
  createKategori,
  deleteKategori,
  editKategori,
  getKategori,
} from "@/Services/Kategori/Kategori.services";
import { responseHandler } from "@/lib/utils";
import Loading from "@/components/Loading";
import { toast } from "sonner";

const Kategori = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredKategori, setFilteredKategori] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getKategori();
      setKategori(response.data);
      setFilteredKategori(response.data);
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // langsung filter saat searchKeyword berubah
  useEffect(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      setFilteredKategori(kategori);
      return;
    }
    const result = kategori.filter((k) =>
      k.name.toLowerCase().includes(keyword)
    );
    setFilteredKategori(result);
  }, [searchKeyword, kategori]);

  const handleTambah = async () => {
    const namaBaru = prompt("Masukkan nama kategori baru:");
    if (namaBaru) {
      try {
        setLoading(true);
        await createKategori({ nama_kategori: namaBaru.trim() });
        toast.success("Kategori berhasil ditambahkan");
        fetchData();
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id) => {
    const namaBaru = prompt(
      "Edit nama kategori:",
      kategori.find((k) => k.id === id)?.name
    );
    if (namaBaru) {
      setLoading(true);
      try {
        await editKategori(id, { nama_kategori: namaBaru.trim() });
        toast.success("Kategori berhasil diedit");
        fetchData();
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      try {
        setLoading(true);
        await deleteKategori(id);
        toast.success("Kategori berhasil dihapus");
        fetchData();
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <ContainerMenu text={"Kategori Buku"}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          onClick={handleTambah}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all"
        >
          <FaPlus />
          Tambah Kategori
        </button>
      </div>
      <input
        type="text"
        placeholder="Cari kategori..."
        className="border mb-4 rounded-md w-full px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      {/* Table */}
      <div className={tableWrapper}>
        <table className={tableBase}>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>#</th>
              <th className={thClass}>Nama Kategori</th>
              <th className={thClass}>Aksi</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {filteredKategori.map((item, index) => (
              <tr key={item.id} className={trHoverClass}>
                <td className={tdClass}>{index + 1}</td>
                <td className={tdClass}>{item.name}</td>
                <td className={`${tdClass} flex gap-3`}>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredKategori.length === 0 && (
              <tr>
                <td
                  className={`${tdClass} text-center text-gray-500`}
                  colSpan="3"
                >
                  Tidak ada kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ContainerMenu>
  );
};

export default Kategori;
