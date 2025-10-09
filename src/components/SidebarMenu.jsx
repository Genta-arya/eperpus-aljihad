import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Settings, Archive, File, Clipboard, School } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { label: "Dashboard", icon: <Home />, href: "/dashboard" },
  { label: "Buku", icon: <File />, href: "/buku" },
  { label: "E-Buku", icon: <Archive />, href: "/ebuku" },
  { label: "Kategori", icon: <Clipboard />, href: "/kategori" },
  { label: "Unit Pendidikan", icon: <School />, href: "/unit-pendidikan" },
];
const SidebarMenus = () => {
  const { pathname } = useLocation();
  if (pathname.includes("/buku/") || pathname.includes("/ebuku/")) {
    return null;
  }

  return (
    <Sidebar className="group peer bg-white border-t-[12px] border-t-green-700  w-20 hover:w-60 transition-all duration-300 ease-in-out">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu, index) => (
                <SidebarMenuItem className="mt-5" key={index}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={menu.href}
                      className={`flex items-center p-2 transition-all duration-300 ease-in-out group relative ${
                        pathname === menu.href ? "bg-green-200" : ""
                      }`}
                    >
                      <div className="flex justify-center items-center w-10 h-10">
                        {menu.icon}
                      </div>

                      <span className="absolute left-14 hidden group-hover:inline-block">
                        {menu.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenus;
