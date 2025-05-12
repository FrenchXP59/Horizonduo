// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import BooksPage from "./pages/BooksPage";
import ServicesPage from "./pages/ServicesPage";
import GamesPage from "./pages/GamesPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function App() {
  return (
    <BrowserRouter>
+     {/* wrapper global pour police et dégradé */}
+     <div className="min-h-screen font-sans bg-accueil">
        <Routes>
          {/* Écran d'accueil */}
          <Route path="/" element={<Welcome />} />

          {/* Page principale */}
          <Route path="/home" element={<HomePage />} />

          {/* Pages section */}
          <Route path="/news/:subcategory?"   element={<NewsPage />} />
          <Route path="/books/:subcategory?"  element={<BooksPage />} />
          <Route path="/services/:subcategory?" element={<ServicesPage />} />
          <Route path="/games/:subcategory?" element={<GamesPage />} />
          <Route path="/partners/:subcategory?" element={<PartnersPage />} />
          <Route path="/contact/:subcategory?" element={<ContactPage />} />

          {/* Redirections */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
+     </div>
    </BrowserRouter>
  );
}