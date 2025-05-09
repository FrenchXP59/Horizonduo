// src/pages/GamesPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./GamesPage.css";

export default function GamesPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const ctx = require.context("../content/games", false, /\.md$/);
    Promise.all(
      ctx.keys().map(async (key) => {
        const text = await fetch(ctx(key)).then((r) => r.text());
        // front-matter parsing
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
        console.log("Parsed game meta:", key, meta);
        return { meta, content: md };
      })
    ).then((data) => {
      // tri par date décroissante
      data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
      setItems(data);
    });
  }, []);

  const subcategories = [
    { key: "cultubike", label: "CultuBike (villas à vélo)", icon: "games-cultubike.webp" },
    { key: "cultutrek", label: "CultuTrek (vieil Antibes)",   icon: "games-cultutrek.webp" },
    { key: "quiz",      label: "Jeux & quizz à venir",        icon: "games-quiz.webp" },
  ];

  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="games-container min-h-screen p-8 bg-gray-50">
      <BackButton />
      <h1 className="text-4xl mb-8">Jeux &amp; Découvertes</h1>

      {/* Grille uniquement si PAS de sous-catégorie */}
      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/games" />
      )}

      {/* Affiche les articles si une sous-catégorie est sélectionnée */}
      {subcategory && (
        filtered.length === 0 ? (
          <p className="mt-6">Aucun contenu pour cette sous-catégorie.</p>
        ) : (
          filtered.map(({ meta, content }, i) => (
            <article key={i} className="games-article prose max-w-none my-8">
              <h2>{meta.title}</h2>
              <time className="block mb-4 text-sm text-gray-500">{meta.date}</time>
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          ))
        )
      )}
    </div>
  );
}
