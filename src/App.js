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

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/partners/:subcategory?" element={<PartnersPage />} />    {/* bien fermé */}
        <Route path="/contact/:subcategory?" element={<ContactPage />} />      {/* bien fermé */}

        {/* Redirections */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}