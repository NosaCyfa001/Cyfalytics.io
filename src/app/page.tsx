"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  BarChart3,
  Brain,
  TrendingUp,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import FloatingThemeToggle from "./components/FloatingThemeToggle";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isDark = mounted && theme === "dark";

  const features = [
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Get insights driven by advanced machine learning models.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Monitor and act instantly with live data visualization.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Your data stays safe with top-level encryption and controls.",
    },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
          : "bg-gradient-to-br from-white via-blue-50 to-blue-100"
      }`}
    >
      {/* Background motion blur orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute w-96 h-96 ${
            isDark ? "bg-blue-500/20" : "bg-blue-300/20"
          } rounded-full blur-3xl`}
          animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className={`absolute w-96 h-96 ${
            isDark ? "bg-purple-500/20" : "bg-purple-300/20"
          } rounded-full blur-3xl`}
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", right: "10%" }}
        />
      </div>

      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Mouse glow follower */}
      <motion.div
        className={`absolute w-96 h-96 ${
          isDark ? "bg-blue-400/10" : "bg-blue-300/10"
        } rounded-full blur-3xl pointer-events-none`}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm mt-4">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Next-Gen Analytics
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Cyfalytics
          </span>
          <span className={isDark ? "text-white" : "text-slate-900"}>.io</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl mb-12 leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Transform your business with{" "}
          <span className="text-blue-400 font-semibold">
            AI-driven analytics
          </span>
          . Visualize, predict, and grow — all in one seamless dashboard.
        </motion.p>

        <FloatingThemeToggle />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          {/* Primary CTA */}
          <Link href="/dashboard">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
            </button>
          </Link>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark
                  ? "bg-slate-800/30 border-slate-700 hover:border-blue-500/30"
                  : "bg-white border-blue-100 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-col items-center">
                <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating visuals */}
        <motion.div
          className="absolute top-20 left-10 opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <BarChart3 className="w-16 h-16 text-blue-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Globe className="w-16 h-16 text-purple-400" />
        </motion.div>
      </div>
    </div>
  );
}
