// src/pages/BooksPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./BooksPage.css";

// Rend les liens Markdown : seuls ceux vers Amazon s’ouvrent en new-tab
function LinkRenderer({ href, children }) {
  const isAmazon = href.includes("amazon");
  return (
    <a
      href={href}
      {...(isAmazon
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

export default function BooksPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  useEffect(() => {
    const ctx = require.context("../content/books", false, /\.md$/);
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

  // Ajout de la 4ᵉ sous-catégorie "Livres"
  const subcategories = [
    { key: "ebooks",    label: "Ebooks & guides pratiques",         icon: "books-ebooks.webp" },
    { key: "notebooks", label: "Carnets de notes",                  icon: "books-notebooks.webp" },
    { key: "travels",   label: "Carnets de voyage",                 icon: "books-travels-journals.webp" },
    { key: "livres",    label: "Livres – publications papier & récits", icon: "books-livre.webp" },
  ];

  // Si une sous-catégorie est sélectionnée, on filtre ; sinon on n’affiche rien
  const filtered = subcategory
    ? items.filter(({ meta }) => meta.subcategory === subcategory)
    : [];

  return (
    <div className="books-container min-h-screen p-8 bg-livres">
      <BackButton />
      <h1 className="text-4xl mb-8">Livres &amp; Carnets</h1>

      {/* Affiche la grille si aucune sous-catégorie n’est sélectionnée */}
      {!subcategory && (
        <SubCategoryGrid categories={subcategories} basePath="/books" />
      )}

      {/* Si sous-catégorie sélectionnée, on affiche les articles */}
      {subcategory && (
        <>
          {filtered.length === 0 ? (
            <p className="mt-6">Aucun contenu pour cette sous-catégorie.</p>
          ) : (
            filtered.map(({ meta, content }, i) => (
              <article key={i} className="books-article prose max-w-none my-8">
                <h2>{meta.title}</h2>
                <time className="block mb-4 text-sm text-gray-500">
                  {meta.date}
                </time>

                {/* Affiche la couverture si présente */}
                {meta.cover && (
                  <img
                    src={meta.cover}
                    alt={meta.title}
                    className="book-cover mb-4"
                  />
                )}

                <ReactMarkdown components={{ a: LinkRenderer }}>
                  {content}
                </ReactMarkdown>
              </article>
            ))
          )}
        </>
      )}
    </div>
  );
}