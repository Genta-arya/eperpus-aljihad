import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = ({
  kategori,
  setKategori,
  unitPendidikan,
  setUnitPendidikan,
  kategoriList = [],
  unitList = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Ambil query dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kategoriParam = params.get("kategori") || "";
    const unitParam = params.get("unitPendidikan") || "";

    setKategori(kategoriParam);
    setUnitPendidikan(unitParam);
  }, []);

  // 🔹 Update URL ketika filter berubah
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (kategori) params.set("kategori", kategori);
    else params.delete("kategori");

    if (unitPendidikan) params.set("unitPendidikan", unitPendidikan);
    else params.delete("unitPendidikan");

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [kategori, unitPendidikan]);

  return (
    <div className="relative mt-4 ">
      {/* 🔸 Tambahkan overflow-x-auto + whitespace-nowrap */}
      <div className="flex gap-4 mb-6  pb-4 overflow-x-auto whitespace-nowrap md:overflow-x-visible scrollbar-hide">
        {/* 🔸 Filter Kategori */}
        <div className="min-w-[200px] flex-shrink-0">
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔸 Filter Unit Pendidikan */}
        <div className="min-w-[200px] flex-shrink-0">
          <select
            value={unitPendidikan}
            onChange={(e) => setUnitPendidikan(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm shadow-sm focus:ring-2  focus:outline-none"
          >
            <option value="">Semua Unit Pendidikan</option>
            {unitList.map((item) => (
              <option
                key={item.id}
                value={item.name || item.nama_lembaga || ""}
              >
                {item.name || item.nama_lembaga}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;
