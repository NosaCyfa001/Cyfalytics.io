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
  CheckCircle2,
  Star,
  Users,
  Award,
  Sparkles,
  LineChart,
  PieChart,
  Activity,
  Database,
  Lock,
  Layers,
  Code,
  Smartphone,
  Cloud,
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

  const stats = [
    { icon: Users, value: "45K+", label: "Active Users" },
    { icon: Award, value: "99.9%", label: "Uptime SLA" },
    { icon: Star, value: "4.8/5", label: "User Rating" },
    { icon: BarChart3, value: "2M+", label: "Data Points" },
  ];

  const capabilities = [
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description:
        "Deep dive into your data with customizable charts, graphs, and real-time metrics.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      title: "Data Integration",
      description:
        "Connect seamlessly with 200+ data sources and sync in real-time.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "Performance Monitoring",
      description:
        "Track KPIs and performance metrics with intelligent alerting systems.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: PieChart,
      title: "Custom Dashboards",
      description:
        "Build personalized dashboards with drag-and-drop widgets in minutes.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Lock,
      title: "Advanced Security",
      description:
        "Enterprise-grade encryption, SSO, and role-based access controls.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description:
        "Scalable infrastructure that grows with your business needs.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const benefits = [
    "Integrate with 200+ data sources",
    "Custom dashboards in minutes",
    "24/7 enterprise support",
    "SOC 2 Type II certified",
    "99.9% uptime guarantee",
    "Free data migration assistance",
    "Advanced API access",
    "White-label options available",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechCorp",
      content:
        "Cyfalytics transformed how we handle data. The AI insights alone saved us 40% in operational costs.",
      avatar: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "VP Analytics, DataFlow",
      content:
        "Best analytics platform we've used. The real-time dashboards are game-changing for our team.",
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "CEO, GrowthLabs",
      content:
        "The ROI was immediate. We saw actionable insights within the first week of implementation.",
      avatar: "EW",
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

      {/* Stats Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl backdrop-blur-sm border text-center ${
                  isDark
                    ? "bg-slate-800/30 border-slate-700"
                    : "bg-white border-blue-100"
                }`}
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Powerful Features
              </span>
            </div>
            <h2
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Everything you need to succeed
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Comprehensive tools designed for modern data-driven teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                  isDark
                    ? "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                    : "bg-white border-blue-100 hover:border-blue-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${capability.gradient} p-2.5 mb-4`}
                >
                  <capability.icon className="w-full h-full text-white" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {capability.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`p-12 md:p-16 rounded-3xl backdrop-blur-sm border ${
              isDark
                ? "bg-slate-900/50 border-slate-800"
                : "bg-white/80 border-blue-100"
            }`}
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-12 text-center ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Why teams choose Cyfalytics.io
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span
                    className={`text-lg ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Loved by teams worldwide
            </h2>
            <p
              className={`text-xl ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-2xl backdrop-blur-sm border ${
                  isDark
                    ? "bg-slate-800/30 border-slate-700"
                    : "bg-white border-blue-100"
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p
                  className={`text-base mb-6 leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Ready to get started?
          </h2>
          <p
            className={`text-xl mb-10 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Join thousands of companies already using Cyfalytics to transform
            their data
          </p>
          <Link href="/dashboard">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 inline-flex items-center gap-3 overflow-hidden">
              <span className="relative z-10">Start Your Free Trial</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
          <p
            className={`text-sm mt-6 ${
              isDark ? "text-slate-500" : "text-slate-600"
            }`}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
