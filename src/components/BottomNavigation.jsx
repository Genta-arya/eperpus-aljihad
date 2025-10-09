import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Buku", path: "/buku" },
    { label: "E-Buku", path: "/ebuku" },
    { label: "Kategori", path: "/kategori" },
    { label: "Unit Pendidikan", path: "/unit-pendidikan" },
  ];

  // Bottom nav utama
  const mainNavItems = [
    { label: "Home", icon: <Home size={20} />, path: "/dashboard" },
    {
      label: "Menu",
      icon: <Menu size={20} />,
      action: () => setIsMenuOpen(true),
    },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  if (location.pathname.startsWith("/laporan/")) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md z-50">
        {mainNavItems.map((item) => (
          <button
            key={item.label}
            onClick={() => (item.path ? navigate(item.path) : item.action?.())}
            className={`flex flex-col items-center text-xs ${
              location.pathname === item.path
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Modal Hamburger Fullscreen */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center space-y-6 text-white">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={30} />
          </button>

          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className={`text-2xl font-semibold ${
                location.pathname === item.path
                  ? "text-green-400"
                  : "text-white"
              } hover:text-green-300 transition`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default BottomNavigation;
