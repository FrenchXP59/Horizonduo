// src/components/SubCategoryGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./SubCategoryGrid.css";

/**
 * categories : [
 *   { key: "bourse",   label: "Bourse & Marchés", icon: "news-stock-analysis.webp" },
 *   { key: "voyages",  label: "Voyages & Récits", icon: "news-travel-stories.webp" },
 *   { key: "ia",       label: "IA & Numérique",    icon: "news-ai-digital.webp" },
 * ]
 * basePath : "/news"
 */
export default function SubCategoryGrid({ categories, basePath }) {
  return (
    <div className="subcat-container">
      <div className="subcat-grid">
        {categories.map(({ key, label, icon }) => (
          <Link key={key} to={`${basePath}/${key}`} className="subcat-card">
            <img
              src={`/assets/icons/${icon}`}
              alt={label}
              width={80}
              height={80}
              className="subcat-icon"
            />
            <span className="subcat-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}