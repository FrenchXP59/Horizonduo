// src/index.js (ou index.jsx si tu préfères garder .jsx)
import "./index.css";                   // ← garde l’import Tailwind en premier
import React from "react";
import ReactDOM from "react-dom/client";

// 1️⃣ Import de HelmetProvider
import { HelmetProvider } from "react-helmet-async";

import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root")
);

root.render(
	<React.StrictMode>
		{/* 2️⃣ On enveloppe l'app pour pouvoir utiliser <Helmet> partout */}
		<HelmetProvider>
			<App />
		</HelmetProvider>
	</React.StrictMode>
);

// 3️⃣ Enregistre le service worker en production
if (process.env.NODE_ENV === "production" && 'serviceWorker' in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then(reg => console.log("SW enregistré :", reg.scope))
			.catch(err => console.error("Échec de l’enregistrement du SW :", err));
	});
}