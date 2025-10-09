import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Container from "../components/Container";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbars from "../components/Navbars";
import MenuHomePage from "../components/MenuHomePage";
import Footer from "../components/Footer";

const HomePage = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = "https://server-yayasan.vercel.app/api/v1/setting/metadata";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const result = await response.json();
        const sliderImages = result.data.sliders[0]?.images || [];
        setSliders(sliderImages);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  return (
    <>
      <div className="overflow-hidden ">
        <Navbars />
        <Slider className="z-10" {...settings}>
          {sliders.map((image, index) => (
            <div key={index} className="relative  z-0 ">
              <img
                src={image.url}
                alt={`Slider ${index}`}
                
                className="w-full h-[400px] object-bottom"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-6">
                <p className="text-white text-lg font-semibold drop-shadow-lg">
                  {image.caption || ""}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="relative flex justify-center z-10">
        <Container>
          <MenuHomePage />
          
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
