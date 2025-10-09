import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white mt-20">
      <div className="w-full mx-auto lg:px-20 py-10 flex lg:flex-row flex-col justify-between items-center text-center md:text-left ">
        {/* Logo / Nama */}
        <div className="">
          <img src="https://www.aljihadketapang.sch.id/Logoweb.png" alt="" className="w-96 bg-white rounded-lg" />
          <p className="text-sm text-center w-96 mt-4 text-gray-200">
            Menyebarkan ilmu dan pengetahuan melalui buku dan e-buku digital.
          </p>
        </div>

        {/* Navigasi */}
        <div className="hidden lg:block">
          <h3 className="font-semibold mb-3 text-lg">Navigasi</h3>
          <ul className="space-y-2 text-gray-200">
            <li><a href="#" className="hover:underline">Beranda</a></li>
            <li><a href="https://www.aljihadketapang.sch.id/" className="hover:underline">Tentang Kami</a></li>
            <li><a href="https://www.aljihadketapang.sch.id/publikasi?q=pengumuman" className="hover:underline">Media</a></li>
          
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-green-800 text-center py-3 text-sm text-gray-200 border-t border-green-600">
        © {new Date().getFullYear()} E-Perpustakaan Yayasan Al-Jihad. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
