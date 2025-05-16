// src/pages/BooksPage.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Helmet } from "react-helmet-async";               // ← Import
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import SwipeWrapper from "../components/SwipeWrapper";
import "./BooksPage.css";

// Rend les liens Markdown : seuls ceux vers Amazon s’ouvrent en new-tab
function LinkRenderer({ href, children }) {
  const isAmazon = href.includes("amazon");
  return (
    <a
      href={href}
      {...(isAmazon ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function BooksPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  // Chargement des .md...
  useEffect(() => {
    const ctx = require.context("../content/books", false, /\.md$/);
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
    { key: "ebooks",    label: "Ebooks & guides pratiques",           icon: "books-ebooks.webp" },
    { key: "notebooks", label: "Carnets de notes",                    icon: "books-notebooks.webp" },
    { key: "travels",   label: "Carnets de voyage",                   icon: "books-travels-journals.webp" },
    { key: "livres",    label: "Livres – publications papier & récits", icon: "books-livre.webp" },
  ];

  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 80,
    appendDots: (dots) => (
      <div>
        <ul className="custom-dots flex gap-2 justify-center mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="w-2 h-2 rounded-full bg-gray-300"></div>,
  };

  // Métadonnées SEO / OG dynamiques selon la sous-catégorie
  const pageTitle = subcategory
    ? subcategories.find((c) => c.key === subcategory)?.label
    : "Livres & Carnets";
  const pageDescription = subcategory
    ? `Découvrez nos ${pageTitle.toLowerCase()} sur Horizon Duo.`
    : "Parcourez nos ebooks, carnets et publications papier.";

  return (
    <div className="books-container min-h-screen p-8 bg-livres">
      {/* 1️⃣ Helmet pour SEO / OG */}
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
        <meta property="og:url" content={`https://horizonduo.net/books/${subcategory || ""}`} />
      </Helmet>

      <BackButton />
      <h1 className="text-4xl mb-8">Livres &amp; Carnets</h1>

      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/books" />
      )}

      {subcategory && (
        filtered.length === 0 ? (
          <p className="mt-6">Aucun contenu pour cette sous-catégorie.</p>
        ) : (
          <SwipeWrapper>
            <Slider {...settings}>
              {filtered.map(({ meta, content }, i) => (
                <div key={i} className="px-4">
                  <article className="books-article prose max-w-none my-8">
                    <h2>{meta.title}</h2>
                    <time className="block mb-4 text-sm text-gray-500">
                      {meta.date}
                    </time>
                    {meta.cover && (
                      <img
                        src={meta.cover}
                        alt={meta.title}
                        className="book-cover mb-4 w-full rounded-lg"
                      />
                    )}
                    <ReactMarkdown components={{ a: LinkRenderer }}>
                      {content}
                    </ReactMarkdown>
                  </article>
                </div>
              ))}
            </Slider>
          </SwipeWrapper>
        )
      )}
    </div>
  );
}