// src/pages/NewsPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./NewsPage.css";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const context = require.context("../content/news", false, /\.md$/);
    Promise.all(
      context.keys().map(async (key) => {
        const text = await fetch(context(key)).then((res) => res.text());
        // Extraction front-matter
        const startIndex = text.indexOf("---");
        const cleanText = startIndex >= 0 ? text.slice(startIndex) : text;
        const match = cleanText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {};
        let md = cleanText;
        if (match) {
          match[1].split(/\r?\n/).forEach((line) => {
            const [k, ...v] = line.split(":");
            let value = v.join(":").trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            meta[k.trim()] = value;
          });
          md = cleanText.slice(match[0].length).trim();
        }
        return { meta, content: md };
      })
    ).then((data) => {
      data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
      setArticles(data);
    });
  }, []);

  const subcategories = [
    { key: "bourse",  label: "Bourse & Marchés",  icon: "news-stock-analysis.webp" },
    { key: "voyages", label: "Voyages & Récits", icon: "news-travel-stories.webp" },
    { key: "ia",      label: "IA & Numérique",    icon: "news-ai-digital.webp" },
  ];

  const filtered = subcategory
    ? articles.filter(({ meta }) => meta.subcategory === subcategory)
    : articles;

  return (
      <div className="news-container min-h-screen p-8 bg-actualites">
      <BackButton />
      <h1 className="news-title">Actualités</h1>

      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/news" />
      )}

      {subcategory && (
        filtered.length === 0 ? (
          <p>Aucun article pour cette sous-catégorie.</p>
        ) : (
          filtered.map(({ meta, content }, i) => (
            <article key={i} className="news-article">
              <h2 className="news-article-title">{meta.title}</h2>
              <time className="news-article-date">{meta.date}</time>
              {meta.cover && (
                <img
                  src={meta.cover}
                  alt={meta.title}
                  className="news-article-cover"
                />
              )}
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          ))
        )
      )}
    </div>
  );
}