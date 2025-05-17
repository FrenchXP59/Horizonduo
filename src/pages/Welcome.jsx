// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Assets via Webpack
import bgWater     from "../assets/accueil/background-water.webp";
import birdOverlay from "../assets/accueil/birds-overlay.webp";
import bubbleImg   from "../assets/accueil/bulle.webp";
import logoNew     from "../assets/accueil/logo-horizon-duo-png.webp";
import sunImg      from "../assets/accueil/icon-sun.webp";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgWater})` }}
    >
      {/* Oiseaux statiques */}
      <img
        src={birdOverlay}
        alt="Birds"
        className="absolute top-6 right-6 w-32 animate-pulse opacity-80 z-20"
      />

      {/* Soleil animé */}
      <img
        src={sunImg}
        alt="Sun"
        className="absolute top-6 left-6 w-20 animate-sun-pulse drop-shadow-lg z-20"
      />

      {/* Bulle tournante + logo centré */}
      <div
        className="absolute left-1/2 top-24 w-64 h-64 rounded-full 
                   transform -translate-x-1/2 overflow-hidden z-10"
      >
        <img
          src={bubbleImg}
          alt="Bulle"
          className="w-full h-full object-cover animate-logo-rotate"
        />
        <img
          src={logoNew}
          alt="Horizon Duo"
          className="absolute inset-0 m-auto w-40 h-40 drop-shadow-2xl 
                     animate-logo-pulse animate-logo-glow"
        />
      </div>

      {/* Bouton ENTER placé sous le logo */}
      <button
        onClick={() => navigate("/home")}
        className="absolute left-1/2 top-[55%] transform -translate-x-1/2
                   w-40 py-3 bg-[#5ce1e6] text-white text-lg font-medium
                   rounded-lg shadow-lg hover:shadow-xl transition z-20"
      >
        ENTER
      </button>

      {/* Texte de bienvenue */}
      <h2
        className="absolute left-1/2 top-[65%] transform -translate-x-1/2
                   text-3xl sm:text-4xl text-white font-bold z-20"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
      >
        Bienvenue
      </h2>
    </div>
  );
}