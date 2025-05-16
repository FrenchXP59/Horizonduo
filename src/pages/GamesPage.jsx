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
        const start = text.indexOf("---");
        const clean = start >= 0 ? text.slice(start) : text;
        const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {}, md = clean;
        if (match) {
          match[1]
            .split(/\r?\n/)
            .forEach((line) => {
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
    { key: "cultubike",   label: "CultuBike (villas à vélo)", icon: "games-cultubike.webp" },
    { key: "cultutrek",   label: "CultuTrek (vieil Antibes)",   icon: "games-cultutrek.webp" },
    { key: "quiz",        label: "Jeux & quizz à venir",        icon: "games-quiz.webp" },
    {
      key:      "quiz-bourse",
      label:    "Quiz Bourse",
      icon:     "games-quiz-bourse.webp",
      external: "https://quiz-bourse-horizonduo-net.netlify.app/"
    },
  ];

  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="games-container min-h-screen p-8 bg-jeux">
      <BackButton />
      <h1 className="text-4xl mb-8">Jeux &amp; Découvertes</h1>

      {/* 1️⃣ Grille si aucune sous-catégorie choisie */}
      {!subcategory && (
        <>
          <SubCategoryGrid categories={subcategories} basePath="/games" />

          {/* 2️⃣ Astuce Mobile sous la grille */}
          <div className="mobile-hint mt-12 p-6 bg-white rounded-xl shadow-md flex items-center space-x-4">
            <img
              src="/assets/icons/icon-phone-home.webp"
              alt="Ajouter à l'écran d'accueil"
              className="w-16 h-16"
            />
            <div>
              <h2 className="text-xl font-semibold mb-1">Ajoutez Horizon Duo</h2>
              <p className="text-gray-700">
                Pour un accès rapide, ajoutez cette application à l’écran d’accueil de votre mobile.
              </p>
            </div>
          </div>
        </>
      )}

      {/* 3️⃣ Contenu Markdown pour sous-catégorie interne */}
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