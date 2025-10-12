import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookOpen } from "react-icons/fa";

const NavigationBack = ({ titles }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/")
  };

  return (
    <div className="border-b w-full py-2 px-4 md:px-12 md:py-4 flex justify-between items-center">
      {/* Tombol back hanya untuk ikon & teks “Kembali” */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
      >
        <FaArrowLeft className="text-base" />
        <span>Kembali</span>
      </button>

      {/* Judul di kanan, tidak bisa diklik */}
      <div className="text-sm md:text-base font-bold uppercase text-gray-800">
        <div className="flex items-center gap-2">
          <FaBookOpen />
          <p>{titles}</p>
        </div>
      </div>
    </div>
  );
};

export default NavigationBack;
