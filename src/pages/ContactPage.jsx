// src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Icon from "../components/Icon";
import "./ContactPage.css";

export default function ContactPage() {
  const [items, setItems] = useState([]);
  const { subcategory } = useParams();

  // Charge tous les MD de src/content/contact
  useEffect(() => {
    const ctx = require.context("../content/contact", false, /\.md$/);
    Promise.all(
      ctx.keys().map(async (key) => {
        const text = await fetch(ctx(key)).then(r => r.text());
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let meta = {}, md = text;
        if (match) {
          // front-matter → meta
          match[1].split(/\r?\n/).forEach(line => {
            const [k, ...v] = line.split(":");
            meta[k.trim()] = v.join(":").trim().replace(/^"|"$/g, "");
          });
          md = text.slice(match[0].length).trim();
        }
        return { meta, content: md };
      })
    ).then(data => {
      data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
      setItems(data);
    });
  }, []);

  // Les 3 sous-catégories de contact
  const subcategories = [
    { key: "email",   label: "Email direct",        icon: "contact-email.webp" },
    { key: "form",    label: "Formulaire de contact", icon: "contact-form.webp" },
    { key: "socials", label: "Réseaux sociaux",     icon: "contact-socials.webp" },
  ];

  // Si une sous-cat est sélectionnée, on filtre l’item correspondant
  const selected = subcategory
    ? items.find(({ meta }) => meta.subcategory === subcategory)
    : null;

  return (
    <div className="contact-container min-h-screen p-8 bg-contact">
      <BackButton />
      <h1 className="text-4xl mb-6">Contact</h1>

      {!selected ? (
        // Affiche la grille d’icônes si aucune sélection
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {subcategories.map(({ key, icon, label }) => (
            <Link
              key={key}
              to={`/contact/${key}`}
              className="flex flex-col items-center bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <Icon name={`contact-${key}`} className="w-20 h-20 mb-2" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      ) : (
        // Affiche le contenu MD de la sous-catégorie
        <article className="contact-article prose mx-auto my-8">
          <h2>{selected.meta.title}</h2>
          {selected.meta.subtitle && (
            <p className="text-gray-600 mb-4">{selected.meta.subtitle}</p>
          )}
          <ReactMarkdown>{selected.content}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}