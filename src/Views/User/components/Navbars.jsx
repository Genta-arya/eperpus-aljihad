import { hijau } from "@/Constant/TableSyles";
import React from "react";
import icon from "../../../assets/icons.png";
const Navbars = () => {
  return (
    <div className={`bg-[${hijau}] px-8 py-4 text-white font-bold flex gap-4 border-b-4 border-yellow-500`}>
      <img src={icon} alt="Logo" className="w-14 rounded-full" />
      <div >
        <h1 className="text-lg font-bold text-white">E-Perpustakaan</h1>
        <p className="text-sm  font-bold">AL-JIHAD Islamic Studies Center</p>
      </div>
    </div>
  );
};

export default Navbars;
