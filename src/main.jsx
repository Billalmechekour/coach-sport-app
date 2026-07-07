import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Retire l'écran de chargement une fois l'app montée et peinte.
// On garde une durée minimale pour que l'animation reste fluide (pas de flash).
(() => {
  if (typeof document === "undefined") return;
  const splash = document.getElementById("hf-splash");
  if (!splash) return;
  const MIN_VISIBLE_MS = 900;
  const startedAt = Number(window.__hfSplashStart || performance.timing?.navigationStart || Date.now());
  const hide = () => {
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
    window.setTimeout(() => {
      splash.classList.add("hf-splash--hide");
      window.setTimeout(() => splash.remove(), 650);
    }, wait);
  };
  // Attendre que le premier rendu soit peint avant de masquer.
  requestAnimationFrame(() => requestAnimationFrame(hide));
})();
