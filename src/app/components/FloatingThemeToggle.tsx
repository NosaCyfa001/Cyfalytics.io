"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function FloatingThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg border
                 border-gray-200 dark:border-gray-700
                 bg-white/70 dark:bg-gray-900/80
                 backdrop-blur-md hover:scale-105 transition-all duration-300
                 z-50"
      aria-label="Toggle theme"
    >
      {currentTheme === "light" ? (
        <Moon className="text-gray-800" size={22} />
      ) : (
        <Sun className="text-yellow-400" size={22} />
      )}
    </button>
  );
}
