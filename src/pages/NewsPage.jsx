// src/pages/NewsPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Helmet } from "react-helmet-async";        // ← pour SEO/OG
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import SwipeWrapper from "../components/SwipeWrapper";
import "./NewsPage.css";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const ctx = require.context("../content/news", false, /\.md$/);
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
      setArticles(data);
    });
  }, []);

  const subcategories = [
    { key: "bourse",  label: "Bourse & Marchés",  icon: "news-stock-analysis.webp" },
    { key: "voyages", label: "Voyages & Récits",  icon: "news-travel-stories.webp" },
    { key: "ia",      label: "IA & Numérique",     icon: "news-ai-digital.webp" },
  ];

  const filtered = subcategory
    ? articles.filter(({ meta }) => meta.subcategory === subcategory)
    : articles;

  // SEO dynamiques
  const pageTitle = subcategory
    ? subcategories.find(c => c.key === subcategory)?.label
    : "Actualités";
  const pageDescription = subcategory
    ? `Tous les articles ${pageTitle.toLowerCase()} sur Horizon Duo.`
    : "Retrouvez nos dernières actualités Horizon Duo.";

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 100,
    appendDots: (dots) => (
      <div><ul className="custom-dots flex gap-2 justify-center mt-4">{dots}</ul></div>
    ),
    customPaging: () => <div className="w-2 h-2 rounded-full bg-gray-300"></div>,
  };

  return (
    <div className="news-container min-h-screen p-8 bg-actualites">
      {/* Helmet pour SEO / OG */}
      <Helmet>
        <title>{pageTitle} – Horizon Duo</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`${pageTitle} – Horizon Duo`} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content="https://horizonduo.net/assets/og-image-horizondouo.webp"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://horizonduo.net/news/${subcategory || ""}`}
        />
      </Helmet>

      <BackButton />
      <h1 className="news-title">Actualités</h1>

      {/* Grille sous-catégories */}
      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/news" />
      )}

      {/* Hint mobile swipe */}
      {subcategory && filtered.length > 0 && (
        <p className="mt-4 text-center text-sm text-gray-500 italic block md:hidden">
          Faites glisser ◀️▶️ pour voir le suivant.
        </p>
      )}

      {/* Carrousel pour afficher les articles */}
      {subcategory && filtered.length > 0 && (
        <SwipeWrapper>
          <Slider {...settings}>
            {filtered.map(({ meta, content }, i) => (
              <div key={i} className="px-4">
                <article className="news-article">
                  <h2 className="news-article-title">{meta.title}</h2>
                  <time className="news-article-date">{meta.date}</time>
                  {meta.cover && (
                    <img
                      src={meta.cover}
                      alt={meta.title}
                      className="news-article-cover mb-4 rounded-lg w-full"
                    />
                  )}
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              </div>
            ))}
          </Slider>
        </SwipeWrapper>
      )}

      {/* Message si aucun article */}
      {subcategory && filtered.length === 0 && (
        <p className="mt-6">Aucun article pour cette sous-catégorie.</p>
      )}
    </div>
  );
}