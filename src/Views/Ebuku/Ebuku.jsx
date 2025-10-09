import React, { useEffect, useState } from "react";
import ContainerMenu from "@/components/ContainerMenu";
import {
  API_DELETE,
  tableBase,
  tableWrapper,
  tbodyClass,
  tdClass,
  thClass,
  theadClass,
  trHoverClass,
} from "@/Constant/TableSyles";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaImage,
  FaSearch,
  FaSync,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { uploadProfile } from "@/Services/Uploads/Uploads.services";
import { getKategori } from "@/Services/Kategori/Kategori.services";
import { getLembaga } from "@/Services/Lembaga/Lembaga.services";
import { responseHandler } from "@/lib/utils";
import Loading from "@/components/Loading";
import Select from "react-select";
import {
  createBuku,
  deleteBuku,
  getBuku,
  searchBook,
  updateBuku,
} from "@/Services/Buku/Buku.services";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

const Ebook = () => {
  const location = useLocation();
  const title = "Daftar E-Buku";
  const [selectedData, setSelectedData] = useState(null);
  const jenis = location.pathname === "/ebuku" ? "ebook" : "buku";
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [lembagaOptions, setLembagaOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buku, setBuku] = useState([]);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    isbn: "",
    tahun: new Date().getFullYear(),
    halaman: "",
    id_kategori: "",
    id_type: "",
    cover: null,
    file_pdf: null,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchMetaData = async () => {
    setLoading(true);
    try {
      const [kategoriRes, lembagaRes] = await Promise.all([
        getKategori(),
        getLembaga(),
      ]);

      setKategoriOptions(
        kategoriRes.data.map((k) => ({
          value: k.id,
          label: k.name || k.nama || k.title,
        }))
      );

      setLembagaOptions(
        lembagaRes.data.map((l) => ({
          value: l.id,
          label: l.name || l.nama_lembaga || l.nama,
        }))
      );
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataBuku = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      let response;
      if (searchKeyword.trim()) {
        // kalau ada keyword, pakai searchBook
        response = await searchBook({
          keyword: searchKeyword,
          page,
          limit,
          type: jenis,
        });
        setBuku(response.data.ebook);
        setPagination(response.data.pagination);
      } else {
        response = await getBuku(`${jenis}?page=${page}&limit=${limit}`);
        setBuku(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([fetchDataBuku(), fetchMetaData()]);
      } catch (err) {
        console.error(err);
      }
    };
    loadAll();
  }, []);

  const handleOpenTambah = () => {
    setFormData({
      judul: "",
      penulis: "",
      penerbit: "",
      isbn: "",
      tahun: new Date().getFullYear(),
      halaman: "",
      id_kategori: "",
      id_type: "",
      cover: null,
      file_pdf: null,
    });
    setPreview(null);
    setShowTambah(true);
  };

  const handleClear = () => {
    setSearchKeyword("");
    refresh();
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await getBuku(`${jenis}?page=1&limit=10`);
      setBuku(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setSelectedData(item);
    setFormData({
      id: item.id,
      judul: item.judul || "",
      penulis: item.penulis || "",
      penerbit: item.penerbit || "",
      isbn: item.isbn || "",
      tahun: item.tahun || new Date().getFullYear(),
      halaman: item.halaman || "",
      id_kategori: item.kategoriId || item.kategori?.id || "",
      id_type: item.typeId || item.type?.id || "",
      cover: item.cover || null,
      file_pdf: item.file || null,
    });
    setPreview(item.cover || null);
    setShowEdit(true);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      if (field === "cover") {
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadFile = async (file) => {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    const res = await uploadProfile(uploadForm);
    return res.data.file_url;
  };

  const uploadFileToGDrive = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64File = reader.result.split(",")[1];

          const res = await fetch(
            "https://script.google.com/macros/s/AKfycbx_qZK7Zjpi0yqn6l1y7L7ATHqmzTg2-HBeZgQ1_rF01yv6QRRDii3V15ezFPYSgwLBGw/exec",
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                file: base64File,
                filename: file.name,
              }),
            }
          );

          const data = await res.json();

          if (data.status === "success") {
            resolve({
              id: data.id,
              url: data.viewUrl || data.url,
            });
          } else {
            reject(data.message || "Upload gagal");
          }
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTambahSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedFileId = null; // simpan ID file Drive sementara

    try {
      let coverUrl = null;
      let pdfUrl = null;

      if (formData.cover) coverUrl = await uploadFile(formData.cover);

      if (formData.file_pdf) {
        const pdfResult = await uploadFileToGDrive(formData.file_pdf);
        pdfUrl = pdfResult.url;
        uploadedFileId = pdfResult.id; // simpan ID
      }

      const payload = {
        cover: coverUrl,
        file: pdfUrl,
        judul: formData.judul,
        penulis: formData.penulis,
        penerbit: formData.penerbit,
        isbn: formData.isbn,
        tahun: parseInt(formData.tahun),
        halaman: parseInt(formData.halaman),
        id_kategori: formData.id_kategori,
        id_type: formData.id_type,
        jenis: "ebuku",
      };

      await createBuku(payload);

      toast.success("E-Buku berhasil ditambahkan");
      setShowTambah(false);
      fetchDataBuku();
    } catch (error) {
      // ❌ Jika API gagal, hapus file dari Drive
      if (uploadedFileId) {
        await deleteFileFromGDrive(uploadedFileId);
      }

      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFileFromGDrive = async (id) => {
    try {
      await fetch(`${API_DELETE}/delete?id=${id}`, {
        method: "GET",
      });
    } catch (err) {
      console.error("Gagal hapus file dari Drive:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newFileId = null; // ID file baru (untuk rollback)
    try {
      let coverUrl = formData.cover;
      let pdfUrl = formData.file_pdf;

      // Ambil URL file lama dengan aman:
      const oldPdfUrl =
        (selectedData &&
          typeof selectedData.file === "string" &&
          selectedData.file) ||
        (typeof formData.file_pdf === "string" ? formData.file_pdf : null);

      // Upload cover baru (jika ada)
      if (formData.cover instanceof File) {
        coverUrl = await uploadFile(formData.cover);
      }

      // Upload PDF baru (jika ada)
      if (formData.file_pdf instanceof File) {
        const uploadRes = await uploadFileToGDrive(formData.file_pdf);

        // uploadFileToGDrive mengembalikan { id, url }
        pdfUrl = uploadRes.url;
        newFileId = uploadRes.id;

        // Hapus file lama di Drive (hanya kalau ada ID)
        if (oldPdfUrl && typeof oldPdfUrl === "string") {
          const oldMatch = oldPdfUrl.match(/[-\w]{25,}/);
          const oldFileId = oldMatch ? oldMatch[0] : null;
          if (oldFileId) {
            console.log("Menghapus file lama ID:", oldFileId);
            await deleteFileFromGDrive(oldFileId);
          } else {
            console.warn("Tidak ditemukan fileId di oldPdfUrl:", oldPdfUrl);
          }
        }
      }

      // Kirim update ke API
      const payload = {
        id: editId,
        cover: coverUrl,
        file: pdfUrl,
        judul: formData.judul,
        penulis: formData.penulis,
        penerbit: formData.penerbit,
        isbn: formData.isbn,
        tahun: parseInt(formData.tahun),
        halaman: parseInt(formData.halaman),
        id_kategori: formData.id_kategori,
        id_type: formData.id_type,
        jenis: "ebuku",
      };

      await updateBuku(payload);
      toast.success("E-Buku berhasil diperbarui");
      setShowEdit(false);
      fetchDataBuku();
    } catch (error) {
      console.error("❌ Gagal update:", error);

      // rollback: hapus file baru kalau sudah terupload
      if (newFileId) {
        try {
          await deleteFileFromGDrive(newFileId);
          console.warn("Rollback: file baru dihapus dari Drive", newFileId);
        } catch (err) {
          console.error("Rollback gagal hapus file baru:", err);
        }
      }

      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus E-Buku ini?")) return;

    try {
      setLoading(true);

      // 🔍 Cari data buku yang akan dihapus
      const bukuToDelete = buku.find((b) => b.id === id);
      if (!bukuToDelete) throw new Error("Data buku tidak ditemukan.");

      // 🔍 Ambil file PDF lama (kalau ada)
      const oldPdfUrl = bukuToDelete.file;
      let oldFileId = null;
      if (oldPdfUrl && typeof oldPdfUrl === "string") {
        const match = oldPdfUrl.match(/[-\w]{25,}/);
        oldFileId = match ? match[0] : null;
      }

      // 🚮 Hapus dulu dari database
      await deleteBuku({ id, jenis: "ebuku" });

      // 🚮 Lalu hapus file dari Google Drive
      if (oldFileId) {
        await deleteFileFromGDrive(oldFileId);
        console.log("🗑️ File dihapus dari Drive:", oldFileId);
      } else {
        console.warn("⚠️ Tidak ditemukan ID file di URL:", oldPdfUrl);
      }

      toast.success("E-Buku dan file PDF berhasil dihapus");
      fetchDataBuku();
    } catch (error) {
      console.error("❌ Gagal hapus E-Buku:", error);
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchDataBuku(1, pagination.limit); // reset ke halaman 1 saat search
  };

  const requiredFields = [
    "cover",
    "file_pdf",
    "judul",
    "penulis",
    "penerbit",
    "isbn",
    "tahun",
    "halaman",
    "id_kategori",
    "id_type",
  ];

  if (loading) return <Loading />;

  return (
    <>
      {!showEdit && !showTambah && (
        <ContainerMenu text={title}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleOpenTambah}
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all"
            >
              <FaPlus /> Tambah E-Buku
            </button>
          </div>

          <div className="flex gap-2 mb-4 relative w-full">
            <input
              type="text"
              placeholder="Cari..."
              className="border rounded-md relative w-full px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 pr-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {/* Button clear */}
            {searchKeyword && (
              <button
                type="button"
                onClick={() => handleClear()}
                className="absolute right-28 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {/* icon reaload */}
                <FaSync />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center gap-2 hover:bg-green-800"
            >
              <FaSearch /> Cari
            </button>
          </div>
          <div className="-mb-10">
            <Pagination
              pagination={pagination}
              onChange={({ page, limit }) => {
                fetchDataBuku(page, limit);
              }}
            />
          </div>

          {/* Table */}
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>#</th>
                  <th className={thClass}>Cover</th>
                  <th className={thClass}>Judul</th>
                  <th className={thClass}>Penulis</th>
                  <th className={thClass}>Penerbit</th>
                  <th className={thClass}>ISBN</th>
                  <th className={thClass}>Tahun</th>
                  <th className={thClass}>Halaman</th>
                  <th className={thClass}>Kategori</th>
                  <th className={thClass}>Unit Pendidikan</th>
                  <th className={thClass}>File PDF</th>
                  <th className={thClass}>Aksi</th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {buku.map((item, index) => (
                  <tr key={item.id} className={trHoverClass}>
                    <td className={tdClass}>
                      {index + 1 + (pagination.page - 1) * pagination.limit}
                    </td>
                    <td className={tdClass}>
                      {item.cover ? (
                        <img
                          onClick={() => window.open(item.cover)}
                          src={item.cover}
                          alt={item.judul}
                          className="w-12 h-16 cursor-pointer object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                          <FaImage />
                        </div>
                      )}
                    </td>
                    <td className={tdClass}>{item.judul}</td>
                    <td className={tdClass}>{item.penulis}</td>
                    <td className={tdClass}>{item.penerbit}</td>
                    <td className={tdClass}>{item.isbn}</td>
                    <td className={tdClass}>{item.tahun}</td>
                    <td className={tdClass}>{item.halaman}</td>
                    <td className={tdClass}>{item.kategori?.name}</td>
                    <td className={tdClass}>{item.type?.name}</td>
                    <td className={tdClass}>
                      {item.file ? (
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={`${tdClass} flex gap-3`}>
                      <button
                        onClick={() => handleOpenEdit(item)}
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
                {buku.length === 0 && loading && (
                  <tr>
                    <td
                      colSpan="12"
                      className={`${tdClass} text-center text-gray-500`}
                    >
                      Tidak ada data E-Buku.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={pagination}
            onChange={({ page, limit }) => {
              fetchDataBuku(page, limit);
            }}
          />
        </ContainerMenu>
      )}
      {/* Modal Tambah & Edit */}
      {(showTambah || showEdit) && (
        <div className="text-xs">
          <div className="bg-white w-full pb-20 l">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              {showTambah ? "Tambah E-Buku" : "Edit E-Buku"}
            </h2>
            <form
              onSubmit={showTambah ? handleTambahSubmit : handleEditSubmit}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Buku
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cover")}
                />
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-24 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  File PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "file_pdf")}
                />
                {formData.file_pdf && !(formData.file_pdf instanceof File) && (
                  <a
                    href={formData.file_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 border hover:underline font-bold text-center text-xs mt-2 block"
                  >
                    {formData.file_pdf}
                  </a>
                )}
              </div>

               <label className="block text-sm font-medium mb-1">
                  Judul Buku
                </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Judul Buku"
                className="w-full border rounded p-2"
                required
              />
               <label className="block text-sm font-medium mb-1">
                  Penulis
                </label>
              <input
                type="text"
                name="penulis"
                value={formData.penulis}
                onChange={handleChange}
                placeholder="Penulis"
                className="w-full border rounded p-2"
              />
               <label className="block text-sm font-medium mb-1">
                  Penerbit
                </label>
              <input
                type="text"
                name="penerbit"
                value={formData.penerbit}
                onChange={handleChange}
                placeholder="Penerbit"
                className="w-full border rounded p-2"
              />
               <label className="block text-sm font-medium mb-1">
                  Nomor ISBN
                </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN"
                className="w-full border rounded p-2"
              />
               <label className="block text-sm font-medium mb-1">
                  Tahun terbit
                </label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                placeholder="Tahun"
                className="w-full border rounded p-2"
              />
               <label className="block text-sm font-medium mb-1">
                  Jumlah halaman
                </label>
              <input
                type="number"
                name="halaman"
                value={formData.halaman}
                onChange={handleChange}
                placeholder="Jumlah Halaman"
                className="w-full border rounded p-2"
              />

               <label className="block text-sm font-medium mb-1">
                  Kategori
                </label>

              <Select
                options={kategoriOptions}
                value={
                  kategoriOptions.find(
                    (opt) => opt.value === formData.id_kategori
                  ) || null
                }
                isClearable
                onChange={(opt) => handleSelectChange("id_kategori", opt)}
                placeholder="Pilih Kategori"
              />
               <label className="block text-sm font-medium mb-1">
                  Unit pendidikan
                </label>

              <Select
                options={lembagaOptions}
                value={
                  lembagaOptions.find(
                    (opt) => opt.value === formData.id_type
                  ) || null
                }
                isClearable
                onChange={(opt) => handleSelectChange("id_type", opt)}
                placeholder="Pilih Unit Pendidikan"
              />

              <div className="flex flex-col-reverse gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTambah(false);
                    setShowEdit(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || requiredFields.some((field) => !formData[field])
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Ebook;
