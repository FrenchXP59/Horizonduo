// src/index.jsx
import "./index.css";                   // ← garde l’import Tailwind en premier
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root")
);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// Enregistre le service worker en production
if (process.env.NODE_ENV === "production" && 'serviceWorker' in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then(reg => console.log("SW enregistré :", reg.scope))
			.catch(err => console.error("Échec de l’enregistrement du SW :", err));
	});
}