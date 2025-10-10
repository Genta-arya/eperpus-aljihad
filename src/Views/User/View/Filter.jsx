import React, { useEffect } from "react";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({
  kategori,
  setKategori,
  unitPendidikan,
  setUnitPendidikan,
  kategoriList,
  unitList,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Siapkan opsi untuk react-select
  const kategoriOptions = [
    { value: "", label: "Semua Kategori" },
    ...kategoriList.map((item) => ({ value: item.name, label: item.name })),
  ];

  const unitOptions = [
    { value: "", label: "Semua Unit Pendidikan" },
    ...unitList.map((item) => ({ value: item.name, label: item.name })),
  ];

  // 🔹 Ambil nilai filter dari query params saat pertama kali load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kategoriParam = params.get("kategori") || "";
    const unitParam = params.get("unitPendidikan") || ""; // ✅ sinkron dengan ListBuku

    if (kategoriParam) setKategori(kategoriParam);
    if (unitParam) setUnitPendidikan(unitParam);
  }, []);

  // 🔹 Update query params setiap kali filter berubah
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (kategori) {
      params.set("kategori", kategori);
    } else {
      params.delete("kategori");
    }

    if (unitPendidikan) {
      params.set("unitPendidikan", unitPendidikan); // ✅ gunakan nama yang sama
    } else {
      params.delete("unitPendidikan");
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [kategori, unitPendidikan]);

  return (
    <div className="relative mt-4 pb-3">
      <div className="flex gap-4 mb-6 overflow-x-auto whitespace-nowrap md:overflow-x-visible scrollbar-hide-mobile">
        {/* 🔹 Filter Kategori */}
        <div className="min-w-[200px] flex-shrink-0">
          <Select
            options={kategoriOptions}
            value={kategoriOptions.find((opt) => opt.value === kategori)}
            onChange={(selected) => setKategori(selected?.value || "")}
            placeholder="Pilih Kategori"
            className="text-sm"
            isClearable
            classNames={{
              control: () =>
                "border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500",
            }}
          />
        </div>

        {/* 🔹 Filter Unit Pendidikan */}
        <div className="min-w-[200px] flex-shrink-0">
          <Select
            options={unitOptions}
            value={unitOptions.find((opt) => opt.value === unitPendidikan)}
            onChange={(selected) => setUnitPendidikan(selected?.value || "")}
            placeholder="Pilih Unit Pendidikan"
            className="text-sm"
            isClearable
            classNames={{
              control: () =>
                "border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
