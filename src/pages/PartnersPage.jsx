// src/pages/PartnersPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./PartnersPage.css";

export default function PartnersPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const ctx = require.context("../content/partners", false, /\.md$/);
    Promise.all(
      ctx.keys().map(async (key) => {
        const text = await fetch(ctx(key)).then(r => r.text());
        // Extraction front-matter
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {}, md = text;
        if (match) {
          match[1].split(/\r?\n/).forEach(line => {
            const [k, ...v] = line.split(":");
            meta[k.trim()] = v.join(":").trim().replace(/^"|"$/g, "");
          });
          md = text.slice(match[0].length).trim();
        }
        return { meta, content: md };
      })
    ).then(data => {
      // tri par date (facultatif si vous n'avez qu'un seul MD)
      data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
      setItems(data);
    });
  }, []);

  // On ne propose QUE Crazy Gipsy
  const subcategories = [
    {
      key: "crazy-gipsy",
      label: "Crazy Gipsy",
      icon: "partners-crazy-gipsy.webp"
    }
  ];

  // Si on est sur /partners/crazy-gipsy, on filtre, sinon on montre la grille
  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="partners-container min-h-screen p-8 bg-gray-50">
      <BackButton />
      <h1 className="text-4xl mb-6">Partenaires</h1>

      {/* Toujours afficher la vignette Crazy Gipsy */}
      <SubCategoryGrid
        categories={subcategories}
        basePath="/partners"
      />

      {/* Si on a cliqué (/partners/crazy-gipsy), on affiche le MD */}
      {subcategory === "crazy-gipsy" && (
        filtered.length > 0 ? (
          filtered.map(({ meta, content }, i) => (
            <article key={i} className="partners-article prose max-w-none my-8">
              <h2>{meta.title}</h2>
              <time className="block mb-4 text-sm text-gray-500">{meta.date}</time>
              <ReactMarkdown>{content}</ReactMarkdown>
              {/* Lien externe selon front-matter (assurez-vous d’avoir une clé `link:`) */}
              {meta.link && (
                <a
                  href={meta.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Visiter le site
                </a>
              )}
            </article>
          ))
        ) : (
          <p className="mt-6">Aucun contenu pour Crazy Gipsy.</p>
        )
      )}
    </div>
  );
}