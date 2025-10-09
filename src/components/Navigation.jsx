import { ArrowLeftCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ text }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Jika ada riwayat sebelumnya, navigasi ke -1, kalau tidak ke "/"
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-end md:items-center gap-2 lg:items-center">
     
      <p className="font-bold text-center text-lg uppercase cursor-default bg-green-700 text-white px-6 py-2 rounded-md">
        {text}
      </p>
    </div>
  );
};

export default Navigation;
