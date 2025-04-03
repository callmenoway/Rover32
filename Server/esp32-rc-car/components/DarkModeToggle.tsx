"use client";
import { useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <button
      onClick={() => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
      }}
      className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-lg shadow-md" //pozione basso sinistra
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
