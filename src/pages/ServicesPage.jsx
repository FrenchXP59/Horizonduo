// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "react-router-dom";  // ← Import Link
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./ServicesPage.css";

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const ctx = require.context("../content/services", false, /\.md$/);
    Promise.all(
      ctx.keys().map(async (key) => {
        const text = await fetch(ctx(key)).then((r) => r.text());
        const start = text.indexOf("---");
        const clean = start >= 0 ? text.slice(start) : text;
        const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {}, md = clean;
        if (match) {
          match[1].split(/\r?\n/).forEach((line) => {
            const [k, ...v] = line.split(":");
            let val = v.join(":").trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            meta[k.trim()] = val;
          });
          md = clean.slice(match[0].length).trim();
        }
        return { meta, content: md };
      })
    ).then((data) => {
      data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
      setItems(data);
    });
  }, []);

  const subcategories = [
    { key: "cv",
      label: "Rédaction de CV",
      icon: "services-cv.webp" },
    { key: "dissertation",
      label: "Aide à la rédaction de mémoires",
      icon: "services-dissertation.webp" },
    { key: "job-interview-visio",
      label: "Coaching entretien (Visio)",
      icon: "services-job-interview-visio.webp" },
    { key: "job-interview-email",
      label: "Coaching entretien (Email)",
      icon: "services-job-interview-email.webp" },
    { key: "custom-game",
      label: "Création de jeux de piste",
      icon: "services-custom-game.webp" },
  ];

  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="services-container min-h-screen p-8 bg-services">
      <BackButton />
      <h1 className="text-4xl mb-8">Mes Services</h1>

      {/* Grille de sous-catégories */}
      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/services" />
      )}

      {/* Contenus de la sous-catégorie sélectionnée */}
      {subcategory && (
        <>
          {filtered.length === 0 ? (
            <p className="mt-6">Aucun contenu pour cette sous-catégorie.</p>
          ) : (
            filtered.map(({ meta, content }, i) => (
              <article key={i} className="services-article prose max-w-none my-8">
                <h2>{meta.title}</h2>
                <time className="block mb-4 text-sm text-gray-500">
                  {meta.date}
                </time>
                <ReactMarkdown>{content}</ReactMarkdown>

                {/* Bouton “Demandez un devis gratuit” */}
                <Link
                  to="/contact/form"
                  className="inline-block mt-6 bg-[#5ce1e6] text-gray-800 font-bold px-6 py-2 rounded-lg shadow hover:shadow-2xl transition"
                >
                  Demandez un devis gratuit
                </Link>

                {/* Liens croisés entre les deux formules */}
                {subcategory === "job-interview-visio" && (
                  <Link
                    to="/services/job-interview-email"
                    className="block mt-4 text-sm underline"
                  >
                    👉 Voir aussi : Coaching par email
                  </Link>
                )}
                {subcategory === "job-interview-email" && (
                  <Link
                    to="/services/job-interview-visio"
                    className="block mt-4 text-sm underline"
                  >
                    👉 Voir aussi : Coaching par visio
                  </Link>
                )}
              </article>
            ))
          )}
        </>
      )}
    </div>
  );
}