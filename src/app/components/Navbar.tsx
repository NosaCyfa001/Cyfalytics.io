"use client";

import { Moon, Sun, Menu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until hydration to show correct theme
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-16 border-b backdrop-blur-md flex items-center justify-between px-6 z-50 transition-all duration-300 ${
        currentTheme === "dark"
          ? "bg-slate-900/70 border-slate-800"
          : "bg-white/70 border-slate-200"
      }`}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle for mobile */}
        {onToggleSidebar && (
          <button
            aria-label="Toggle sidebar"
            className={`md:hidden p-2 rounded-lg border transition-all duration-200 ${
              currentTheme === "dark"
                ? "border-slate-700 hover:bg-slate-800"
                : "border-slate-200 hover:bg-slate-100"
            }`}
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </button>
        )}

        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          Cyfalytics<span className={currentTheme === "dark" ? "text-white" : "text-slate-900"}>.io</span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          className={`p-2 rounded-full border transition-all duration-300 ${
            currentTheme === "dark"
              ? "border-slate-700 hover:bg-slate-800"
              : "border-slate-200 hover:bg-slate-100"
          }`}
        >
          {currentTheme === "light" ? (
            <Moon className="text-slate-800 " size={20} />
          ) : (
            <Sun className="text-yellow-400" size={20} />
          )}
        </button>

        {/* Clerk User Menu */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </nav>
  );
}
