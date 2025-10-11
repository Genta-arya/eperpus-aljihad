import React from "react";
import { useLocation } from "react-router-dom";
import notfoundImg from "../../../assets/notefound.png"; // ilustrasi 404
// gambar network error dari link (bisa kamu download atau langsung pakai URL)
const networkErrorImg =
  "https://img.freepik.com/vektor-premium/ilustrasi-vektor-konsep-500-kesalahan-server-internal-atau-kesalahan-situs-web-atau-kesalahan-jaringan-atau-cloud-com_675567-7790.jpg";

const Notfound = ({ errormessage }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("q") || "";

  // 🔹 Tentukan gambar & pesan berdasarkan error
  const is404 = errormessage === "404";
  const imageSrc = is404 ? notfoundImg : networkErrorImg;

  const message = is404 ? (
    <>
      Yahh, buku{" "}
      <span className="underline text-red-500 font-semibold">{keyword}</span>{" "}
      yang kamu cari tidak ditemukan 😢
    </>
  ) : (
    <>
      Terjadi kesalahan jaringan 😔
      <br />
      Silakan periksa koneksi internet kamu dan coba lagi.
    </>
  );
  if (errormessage === "no") return null;
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-[65vh] text-center px-4">
      <img
        src={imageSrc}
        alt={is404 ? "Buku tidak ditemukan" : "Kesalahan jaringan"}
        className={`${
          is404
            ? "max-w-xs sm:max-w-sm rounded-full bg-black"
            : "max-w-md sm:max-w-lg rounded-xl"
        } object-contain  opacity-95`}
      />

      <p className="text-gray-600 font-semibold text-base sm:text-lg md:text-xl leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default Notfound;
