import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentikasi from "./Views/Authentikasi/Authentikasi";
import Dashboard from "./Views/Dashboard/Dashboard";

import HalamanNotFound from "./components/HalamanNotFound";
import Layout from "./Layout";

import { Toaster } from "sonner";
import HomePage from "./Views/User/View/HomePage";
import Buku from "./Views/Buku/Buku";

import Ebook from "./Views/Ebuku/ebuku";
import Lembaga from "./Views/Type/Type";
import Kategori from "./Views/Kategori/Kategori";

const RouteApp = () => {
  return (
    <Router>
      <Routes>
        {/* Route tanpa Layout */}
        <Route path="/login" element={<Authentikasi />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buku" element={<Buku />} />
          <Route path="/ebuku" element={<Ebook />} />
          <Route path="/kategori" element={<Kategori />} />
          <Route path="/unit-pendidikan" element={<Lembaga />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        duration={3000}
      />
    </Router>
  );
};

export default RouteApp;
