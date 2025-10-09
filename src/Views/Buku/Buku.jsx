import React, { useEffect, useState } from "react";
import ContainerMenu from "@/components/ContainerMenu";
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

const Buku = () => {
  const location = useLocation();
  let title = "Daftar Buku";
  const jenis = location.pathname === "/ebuku" ? "ebook" : "buku"; // jenis buku/ebook

  if (location.pathname === "/ebuku") title = "Daftar E-Buku";
  const [pagination, setPagination] = useState({});
  const [loadingBuku, setLoadingBuku] = useState(false);

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [lembagaOptions, setLembagaOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buku, setBuku] = useState([]);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    kategori: "",
    halaman: "",
    isbn: "",
    lokasi: "",
    jumlah: "",
    cover: null,
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
    setLoadingBuku(true);
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
      setLoadingBuku(false);
    }
  };

  // useEffect(() => {
  //   const loadAll = async () => {
  //     try {
  //       await Promise.all([fetchDataBuku(), fetchMetaData()]);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   loadAll();
  // }, []);

  useEffect(() => {
    fetchDataBuku();
  }, []);

  useEffect(() => {
    fetchMetaData();
  }, []);

  const handleClear = () => {
    setSearchKeyword("");
    refresh();
  };

  const refresh = async () => {
    setLoadingBuku(true);
    try {
      const response = await getBuku(`${jenis}?page=1&limit=10`);
      setBuku(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoadingBuku(false);
    }
  };

  const handleOpenTambah = () => {
    setFormData({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: new Date().getFullYear(),
      kategori: "",
      isbn: "",
      lokasi: "",
      jumlah: "",
      cover: null,
    });
    setPreview(null);
    setShowTambah(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setFormData({
      id: item.id,
      judul: item.judul || "",
      penulis: item.penulis || "",
      penerbit: item.penerbit || "",
      tahun: item.tahun || new Date().getFullYear(),
      halaman: item.halaman || "",
      isbn: item.isbn || "",
      lokasi: item.lokasirak || "", // disamakan dengan field input
      jumlah: item.jumlah || "",
      kategori: item.kategoriId || item.kategori?.id || "",
      unit_pendidikan: item.typeId || item.type?.id || "",
      cover: item.cover || null,
    });
    setPreview(item.cover || null);
    setShowEdit(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleTambahSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverUrl = null;

      // Upload cover jika ada file
      if (formData.cover) {
        const uploadForm = new FormData();
        uploadForm.append("file", formData.cover);

        const uploadResponse = await uploadProfile(uploadForm);
        coverUrl = uploadResponse.data.file_url;
      }

      // Buat data untuk dikirim ke API
      const payload = {
        id_kategori: formData.kategori,
        id_type: formData.unit_pendidikan, // asumsi ini lembaga/unit pendidikan
        judul: formData.judul,
        penulis: formData.penulis,
        penerbit: formData.penerbit,
        isbn: formData.isbn,
        tahun: parseInt(formData.tahun),
        stok: parseInt(formData.jumlah),
        cover: coverUrl,
        lokasirak: formData.lokasi,
        halaman: formData.halaman || null,
        jenis: "buku",
      };

      // Kirim ke API
      const res = await createBuku(payload);

      // Update state tabel setelah berhasil
      const newBook = {
        id: res.data?.id || Date.now(),
        ...formData,
        cover: coverUrl,
      };
      setBuku((prev) => [...prev, newBook]);

      // Tutup modal dan reset form
      setShowTambah(false);
      setFormData({
        judul: "",
        penulis: "",
        penerbit: "",
        tahun: new Date().getFullYear(),
        kategori: "",
        isbn: "",
        lokasi: "",
        jumlah: "",
        cover: null,
      });

      setPreview(null);
      refresh();
    } catch (error) {
      console.error(error);
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverUrl = formData.cover;

      // Kalau user upload file baru, upload ulang
      if (formData.cover instanceof File) {
        const uploadForm = new FormData();
        uploadForm.append("file", formData.cover);
        const uploadResponse = await uploadProfile(uploadForm);
        coverUrl = uploadResponse.data.file_url;
      }

      const payload = {
        id_kategori: formData.kategori,
        id_type: formData.unit_pendidikan,
        judul: formData.judul,
        penulis: formData.penulis,
        penerbit: formData.penerbit,
        isbn: formData.isbn,
        tahun: parseInt(formData.tahun),
        stok: parseInt(formData.jumlah),
        cover: coverUrl,
        lokasirak: formData.lokasi,
        halaman: formData.halaman || null,
        id: editId,
        jenis: "buku",
      };

      await updateBuku(payload);
      toast.success("Buku berhasil diperbarui");

      // Update di state React
      setBuku((prev) =>
        prev.map((b) =>
          b.id === editId ? { ...b, ...payload, cover: coverUrl } : b
        )
      );

      setShowEdit(false);
      refresh();
    } catch (error) {
      console.error(error);
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      try {
        setLoading(true);

        await deleteBuku({ id, jenis: "buku" });
        setBuku(buku.filter((b) => b.id !== id));
        refresh();
        toast.success("Buku berhasil dihapus");
      } catch (error) {
        responseHandler(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    { name: "judul", label: "Judul", placeholder: "Judul Buku" },
    { name: "penulis", label: "Penulis", placeholder: "Penulis Buku" },
    { name: "penerbit", label: "Penerbit", placeholder: "Penerbit Buku" },
    { name: "tahun", label: "Tahun terbit", placeholder: "Tahun Terbit" },
    { name: "halaman", label: "Halaman", placeholder: "Jumlah Halaman" },
    { name: "isbn", label: "ISBN", placeholder: "Nomor ISBN" },
    { name: "lokasi", label: "Lokasi Rak", placeholder: "Lokasi Rak" },
    { name: "jumlah", label: "Jumlah", placeholder: "Jumlah Buku" },
  ];

  const requiredFields = [
    "cover",
    "judul",
    "penulis",
    "kategori",
    "unit_pendidikan",
    "lokasi",
    "jumlah",
    "tahun",
    "halaman",
    "penerbit",
    "isbn",
  ];

  const handleSearch = () => {
    fetchDataBuku(1, pagination.limit); // reset ke halaman 1 saat search
  };

  if (loading || loadingBuku) return <Loading />;

  return (
    <>
      {!showTambah && !showEdit && (
        <ContainerMenu text={title}>
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleOpenTambah}
                className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all"
              >
                <FaPlus /> Tambah Buku
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

            <div className={tableWrapper}>
              <table className={tableBase}>
                <thead className={theadClass}>
                  <tr>
                    <th className={thClass}>#</th>
                    <th className={thClass}>Cover</th>
                    <th className={thClass}>Judul</th>
                    <th className={thClass}>Penulis</th>
                    <th className={thClass}>Penerbit</th>
                    <th className={thClass}>Tahun terbit</th>
                    <th className={thClass}>ISBN</th>
                    <th className={thClass}>Lokasi Rak</th>
                    <th className={thClass}>Kategori</th>
                    <th className={thClass}>Unit Pendidikan</th>
                    <th className={thClass}>Jumlah</th>
                    <th className={thClass}>Aksi</th>
                  </tr>
                </thead>
                <tbody className={tbodyClass}>
                  {loadingBuku ? (
                    <></>
                  ) : buku.length === 0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        className={`${tdClass} text-center pt-4 text-gray-500`}
                      ></td>
                    </tr>
                  ) : (
                    buku.map((item, index) => (
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
                              className="w-12 cursor-pointer h-16 object-cover rounded"
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
                        <td className={tdClass}>{item.tahun}</td>
                        <td className={tdClass}>{item.isbn}</td>
                        <td className={tdClass}>{item.lokasirak}</td>
                        <td className={tdClass}>
                          {item.kategori?.name || "-"}
                        </td>
                        <td className={tdClass}>{item.type?.name || "-"}</td>
                        <td className={`${tdClass} font-medium text-green-700`}>
                          {item.jumlah}
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
                    ))
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
          </>
        </ContainerMenu>
      )}

      {/* Modal Tambah */}
      {showTambah && (
        <div className="text-xs">
          <div className="bg-white  w-full  pb-20 lg:pb-6  ">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Tambah Buku
            </h2>
            <form onSubmit={handleTambahSubmit} className="space-y-3">
              {/* Upload cover */}
              <div>
                <label className="block text-sm font-medium">Cover Buku</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded-md px-3 py-2 w-full"
                />
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Input lain */}
              {fields.map(({ name, label, placeholder }) => (
                <div key={name} className="text-xs">
                  <label className="block  text-xs font-medium capitalize mb-2">
                    {label}
                  </label>
                  <input
                    type={
                      name === "jumlah" ||
                      name === "tahun" ||
                      name === "halaman"
                        ? "number"
                        : "text"
                    }
                    name={name}
                    placeholder={placeholder}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-2">
                  Pilih Kategori
                </label>
                <Select
                  options={kategoriOptions}
                  className="text-xs"
                  placeholder="Pilih kategori..."
                  value={kategoriOptions.find(
                    (o) => o.value === formData.kategori
                  )}
                  onChange={(opt) => handleSelectChange("kategori", opt)}
                  isClearable
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">
                  Unit Pendidikan
                </label>
                <Select
                  options={lembagaOptions}
                  placeholder="Pilih lembaga..."
                       className="text-xs"
                  value={lembagaOptions.find(
                    (o) => o.value === formData.unit_pendidikan
                  )}
                  onChange={(opt) => handleSelectChange("unit_pendidikan", opt)}
                  isClearable
                />
              </div>

              <div className="flex flex-col-reverse gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTambah(false);
                    //  scroll ke atas
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || requiredFields.some((field) => !formData[field])
                  }
                  className="px-4 py-2 bg-green-700 disabled:bg-gray-500 text-white rounded-md hover:bg-green-800"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="text-xs">
          <div className="bg-white w-full  pb-20 ">
            <h2 className="text-xl font-bold mb-4 text-green-700">Edit Buku</h2>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              {/* Upload cover */}
              <div>
                <label className="block text-sm font-medium">Cover Buku</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded-md px-3 py-2 w-full"
                />
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 w-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Input lain (judul, penulis, dll) */}
              {fields.map(({ name, label , placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium capitalize mb-2">
                    {label}
                  </label>
                  <input
                    type={
                      name === "jumlah" ||
                      name === "tahun" ||
                      name === "halaman"
                        ? "number"
                        : "text"
                    }
                    name={name}
                    placeholder={placeholder}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
                    required
                  />
                </div>
              ))}

              {/* Select kategori */}
              <div>
                <label className="block text-sm font-medium">
                  Pilih Kategori
                </label>
                <Select
                  options={kategoriOptions}
                  placeholder="Pilih kategori..."
                  value={kategoriOptions.find(
                    (o) => o.value === formData.kategori
                  )}
                  onChange={(opt) => handleSelectChange("kategori", opt)}
                  isClearable
                />
              </div>

              {/* Select lembaga / unit pendidikan */}
              <div>
                <label className="block text-sm font-medium">
                  Pilih Lembaga / Unit Pendidikan
                </label>
                <Select
                  options={lembagaOptions}
                  placeholder="Pilih lembaga..."
                  value={lembagaOptions.find(
                    (o) => o.value === formData.unit_pendidikan
                  )}
                  onChange={(opt) => handleSelectChange("unit_pendidikan", opt)}
                  isClearable
                />
              </div>

              {/* Tombol */}
              <div className="flex flex-col-reverse gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false),
                      window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || requiredFields.some((field) => !formData[field])
                  }
                  className="px-4 py-2 bg-green-700 disabled:bg-gray-500 text-white rounded-md hover:bg-green-800"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Buku;
