// src/pages/BooksPage.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import Slider from "react-slick";                         
import "slick-carousel/slick/slick.css";                  
import "slick-carousel/slick/slick-theme.css";            

import BackButton from "../components/BackButton";
import SubCategoryGrid from "../components/SubCategoryGrid";
import "./BooksPage.css";

// Wrapper qui bloque le swipe si c’est majoritairement vertical
function SwipeWrapper({ children }) {
  const touch = useRef({ x: 0, y: 0 });
  const onTouchStart = e => {
    touch.current.x = e.touches[0].pageX;
    touch.current.y = e.touches[0].pageY;
  };
  const onTouchMove = e => {
    const dx = e.touches[0].pageX - touch.current.x;
    const dy = e.touches[0].pageY - touch.current.y;
    if (Math.abs(dy) > Math.abs(dx) * 1.5) {
      e.stopPropagation();
    }
  };
  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
      {children}
    </div>
  );
}

// Rend les liens Markdown : seuls ceux vers Amazon s’ouvrent en new-tab
function LinkRenderer({ href, children }) {
  const isAmazon = href.includes("amazon");
  return (
    <a href={href} {...(isAmazon ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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
      ctx.keys().map(async key => {
        const text = await fetch(ctx(key)).then(r => r.text());
        const start = text.indexOf("---");
        const clean = start >= 0 ? text.slice(start) : text;
        const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {}, md = clean;
        if (match) {
          match[1].split(/\r?\n/).forEach(line => {
            const [k, ...v] = line.split(":");
            let val = v.join(":").trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            meta[k.trim()] = val;
          });
          md = clean.slice(match[0].length).trim();
        }
        return { meta, content: md };
      })
    ).then(data => {
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

  const filtered = subcategory ? items.filter(({ meta }) => meta.subcategory === subcategory) : [];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 80,
    appendDots: dots => (
      <div>
        <ul className="custom-dots flex gap-2 justify-center mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="w-2 h-2 rounded-full bg-gray-300"></div>,
  };

  return (
    <div className="books-container min-h-screen p-8 bg-livres">
      <BackButton />
      <h1 className="text-4xl mb-8">Livres &amp; Carnets</h1>

      {!subcategory && <SubCategoryGrid categories={subcategories} basePath="/books" />}

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
                    <time className="block mb-4 text-sm text-gray-500">{meta.date}</time>
                    {meta.cover && (
                      <img src={meta.cover} alt={meta.title} className="book-cover mb-4 w-full rounded-lg" />
                    )}
                    <ReactMarkdown components={{ a: LinkRenderer }}>{content}</ReactMarkdown>
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