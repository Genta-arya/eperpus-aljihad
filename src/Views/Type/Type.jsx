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

import { responseHandler } from "@/lib/utils";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import {
  createLembaga,
  deleteLembaga,
  editLembaga,
  getLembaga,
} from "@/Services/Lembaga/Lembaga.services";

const Lembaga = () => {
  const [Lembaga, setLembaga] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getLembaga();
      setLembaga(response.data);
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleTambah = async () => {
    const namaBaru = prompt("Masukkan nama Unit Pendidikan baru:");
    if (namaBaru) {
      try {
        setLoading(true);
        await createLembaga({ nama_Lembaga: namaBaru.trim() });
        toast.success("Unit Pendidikan berhasil ditambahkan");
        fetchData();
        setLembaga([...Lembaga, { id: Date.now(), nama: namaBaru.trim() }]);
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id) => {
    const namaBaru = prompt(
      "Edit nama Unit Pendidikan:",
      Lembaga.find((k) => k.id === id)?.name
    );
    if (namaBaru) {
      setLoading(true);
      try {
        await editLembaga(id, { nama_Lembaga: namaBaru.trim() });
        setLembaga(
          Lembaga.map((k) =>
            k.id === id ? { ...k, nama: namaBaru.trim() } : k
          )
        );
        fetchData();
        toast.success("Unit Pendidikan berhasil diedit");
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus Unit Pendidikan ini?")) {
      try {
        setLoading(true);
        await deleteLembaga(id);
        setLembaga(Lembaga.filter((k) => k.id !== id));
        fetchData();
        toast.success("Unit Pendidikan berhasil dihapus");
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <ContainerMenu text={"Unit Pendidikan"}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all"
        >
          <FaPlus />
          Tambah Unit Pendidikan
        </button>
      </div>

      {/* Table */}
      <div className={tableWrapper}>
        <table className={tableBase}>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>#</th>
              <th className={thClass}>Nama Unit Pendidikan</th>
              <th className={thClass}>Aksi</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {Lembaga.map((item, index) => (
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

            {Lembaga.length === 0 && (
              <tr>
                <td
                  className={`${tdClass} text-center text-gray-500`}
                  colSpan="3"
                >
                  Tidak ada Unit Pendidikan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ContainerMenu>
  );
};

export default Lembaga;
