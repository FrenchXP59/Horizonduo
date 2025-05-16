// src/components/SubCategoryGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./SubCategoryGrid.css";

/**
 * categories : [
 *   { key: "bourse",   label: "Bourse & Marchés", icon: "news-stock-analysis.webp" },
 *   { key: "voyages",  label: "Voyages & Récits", icon: "news-travel-stories.webp" },
 *   { key: "ia",       label: "IA & Numérique",    icon: "news-ai-digital.webp" },
 *   { key: "quiz-bourse", label: "Quiz Bourse",    icon: "games-quiz-bourse.webp", external: "https://quiz-bourse-horizonduo-net.netlify.app/" },
 * ]
 * basePath : "/news"
 */
export default function SubCategoryGrid({ categories, basePath }) {
  return (
    <div className="subcat-container">
      <div className="subcat-grid">
        {categories.map(({ key, label, icon, external }) => {
          // Choix du wrapper : <a> pour externe, <Link> pour interne
          const Wrapper = external ? "a" : Link;
          const wrapperProps = external
            ? { href: external, target: "_blank", rel: "noopener noreferrer" }
            : { to: `${basePath}/${key}` };

          return (
            <Wrapper
              key={key}
              {...wrapperProps}
              className="subcat-card"
            >
              <img
                src={`/assets/icons/${icon}`}
                alt={label}
                width={80}
                height={80}
                className="subcat-icon"
              />
              <span className="subcat-label">{label}</span>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}