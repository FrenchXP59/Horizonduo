import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Retour" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 text-sm text-teal-600 hover:underline"
    >
      ← {label}
    </button>
  );
}
