// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function HomePage() {
  const items = [
    { name: "news",            label: "Actualités",         path: "/news" },
    { name: "books-notebooks", label: "Livres & Carnets",   path: "/books" },
    { name: "discovery",       label: "Jeux & Découvertes", path: "/games" },
    { name: "services",        label: "Mes Services",       path: "/services" },
    { name: "partners",        label: "Partenaires",        path: "/partners" },
    { name: "contact",         label: "Contact",            path: "/contact" },
  ];

  return (
    <div className="min-h-screen p-8 bg-[linear-gradient(to_bottom,#eaf7ff,#cce3f4)]">
      <h1 className="text-5xl font-semibold font-sans text-center mb-12 animate-fade-in">
        Horizon Duo
      </h1>
      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))" }}
      >
        {items.map(({ name, label, path }) => (
          <Link
            key={name}
            to={path}
            className="flex flex-col items-center bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6"
          >
            <Icon
              name={`home-${name}`}
              className="w-24 h-24 mb-4 animate-logo-pulse"
            />
            <span className="font-fredoka text-lg">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}