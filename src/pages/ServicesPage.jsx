// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
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
        let meta = {};
        let md = clean;
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
    { key: "cv",           label: "Rédaction de CV",                       icon: "services-cv.webp" },
    { key: "memoire",      label: "Aide à la rédaction de mémoires",         icon: "services-dissertation.webp" },
    { key: "coaching",     label: "Coaching entretien d'embauche",           icon: "services-job-interview.webp" },
    { key: "job-interview",label: "Préparation à l'entretien (job-interview)",icon: "services_job_interview.webp" },
    { key: "custom-game",  label: "Création personnalisée de jeux",         icon: "services_custom_game.webp" },
  ];

  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="services-container min-h-screen p-8 bg-gray-50">
      <BackButton />
      <h1 className="text-4xl mb-8">Mes Services</h1>

      {/* Affiche la grille uniquement si aucune sous-catégorie n'est sélectionnée */}
      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/services" />
      )}

      {/* Affiche les articles uniquement si une sous-catégorie est sélectionnée */}
      {subcategory && (
        <>
          {filtered.length === 0 ? (
            <p className="mt-6">Aucun contenu pour cette sous-catégorie.</p>
          ) : (
            filtered.map(({ meta, content }, i) => (
              <article key={i} className="services-article prose max-w-none my-8">
                <h2>{meta.title}</h2>
                <time className="block mb-4 text-sm text-gray-500">{meta.date}</time>
                <ReactMarkdown>{content}</ReactMarkdown>
                {/* Bouton demande de devis */}
                <a
                  href={`mailto:lescarnetsduo@yahoo.com?subject=Demande%20devis%20${encodeURIComponent(meta.title)}&body=Bonjour,%20je%20souhaite%20un%20devis%20concernant%20${encodeURIComponent(meta.title)}`}
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Demande de devis
                </a>
              </article>
            ))
          )}
        </>
      )}

    </div>
  );
}
