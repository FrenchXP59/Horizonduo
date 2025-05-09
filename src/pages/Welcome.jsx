// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Assets via Webpack
import bgWater from "../assets/accueil/background-water.webp";
import birdOverlay from "../assets/accueil/birds-overlay.webp";  // converted to WebP
import logoTransparent from "../assets/accueil/logo-transparent.png";
import sunImg from "../assets/accueil/icon-sun.webp";
import textImage from "../assets/accueil/text-intro.webp";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgWater})` }}
    >
      {/* Oiseaux statiques, léger battement d'ailes */}
      <img
        src={birdOverlay}
        alt="Birds"
        className="absolute top-8 right-8 w-32 h-auto animate-pulse opacity-80"
      />

      {/* Soleil animé */}
      <img
        src={sunImg}
        alt="Sun"
        className="absolute top-8 left-8 w-20 h-20 animate-sun-pulse drop-shadow-lg"
      />

      {/* Contenu central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
        {/* Logo transparent agrandi, effets pulse + glow */}
        <img
          src={logoTransparent}
          alt="Horizon Duo"
          className="w-56 h-56 drop-shadow-2xl animate-logo-pulse animate-logo-glow"
        />

        {/* Texte d'intro (image + vague) */}
        <img
          src={textImage}
          alt="Bienvenue et introduction"
          className="w-72 drop-shadow-lg animate-fade-in"
        />
      </div>

      {/* Bouton ENTER turquoise vif */}
      <button
        onClick={() => navigate("/home")}
        className="enter-btn absolute bottom-20 left-1/2 transform -translate-x-1/2
                   w-40 py-3 bg-[#5ce1e6] text-white text-lg font-medium rounded-lg
                   shadow-lg hover:shadow-xl transition"
      >
        ENTER
      </button>
    </div>
  );
}
