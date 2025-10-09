import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Container from "../components/Container";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbars from "../components/Navbars";
import MenuHomePage from "../components/MenuHomePage";
import Footer from "../components/Footer";
import imageperpus from "../../../assets/perpus.jpg";
import icon from "../../../assets/icons.png";
import buku from "../../../assets/buku.jpg";
import PustakaSpoiler from "./PustakaSpoiler";
const HomePage = () => {
  const [sliders] = useState([{ url: imageperpus }]);
  const [showStickyNavbar, setShowStickyNavbar] = useState(false);

  // Handle scroll untuk navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowStickyNavbar(true);
      } else {
        setShowStickyNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <>
      {/* Slider Fixed */}
      <div className=" top-0 left-0 w-full h-[400px] z-0 overflow-hidden">
        <Slider {...settings}>
          {sliders.map((image, index) => (
            <div
              key={index}
              className="relative w-full lg:h-[400px] md:h-[400px] "
            >
              <img
                src={image.url}
                alt={`Slider ${index}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gelap */}
              <div className="absolute inset-0 bg-black/60"></div>

              <div className="absolute top-16 md:top-10 inset-0 flex flex-col justify-center items-center text-center px-2">
                {/* Gambar Buku di Tengah */}
                <img
                  src={buku}
                  alt="Buku"
                  className="md:w-32 w-12 mb-4 rounded-full "
                />

                <h1 className="text-base md:text-4xl font-bold text-white drop-shadow-lg animate-fadeIn">
                  Al-Jihad Islamic Studies Center
                </h1>
                <p className="mt-0 md:mt-4 text-xs md:text-sm text-white drop-shadow-md animate-fadeIn delay-200">
                  Ilmu yang dibaca hari ini, membentuk masa depan yang gemilang.
                </p>
                <p className="lg:block hidden md:block text-sm mb-5 md:mb-0 mt-2 md:text-base text-white drop-shadow-md animate-fadeIn delay-200">
                  Jl. Banu Kasi, Mulia Kerta, Kec. Benua Kayong, Kabupaten
                  Ketapang
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Navbar Versi 1 (animasi muncul) */}
      <div
        className={`fixed top-0 left-0 w-full z-20 transition-transform duration-500 ${
          showStickyNavbar ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={` lg:px-20 px-6 py-4 text-white font-bold flex items-center gap-4`}
        >
          <img src={icon} alt="Logo" className="w-14 rounded-full" />
          <div>
            <h1 className="text-lg font-bold text-white">E-Perpustakaan</h1>
          </div>
        </div>
      </div>

      {/* Navbar Versi 2 (sticky saat scroll) */}
      <div
        className={`fixed top-0 left-0 w-full z-30 transition-opacity duration-500 ${
          showStickyNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Navbars />
      </div>

      {/* Konten halaman di bawah slider */}
      <div className="relative z-0  md:pt-[0px]">
        <Container>
          <MenuHomePage />

          <PustakaSpoiler />
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
