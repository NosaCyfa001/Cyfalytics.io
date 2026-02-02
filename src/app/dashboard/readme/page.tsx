"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Workflow,
} from "lucide-react";
import Link from "next/link";

export default function ReadmePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
              Next.js 14 • TypeScript • Tailwind CSS • WebSocket
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight px-4">
            Cyfalytics.io
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            A production-ready analytics dashboard with real-time notifications,
            smart data polling, WebSocket integration, and AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Rocket className="w-4 h-4" />
                Go to Dashboard
              </button>
            </Link>
            <Link
              href="https://github.com/NosaCyfa001/Cyfalytics.io"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <FileCode className="w-4 h-4" />
                View on GitHub
              </button>
            </Link>
          </div>
        </div>

        {/* What is Cyfalytics */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              What is Cyfalytics.io?
            </h2>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Cyfalytics.io is a full-stack analytics platform built to
                demonstrate production-grade practices: WebSocket real-time
                updates, intelligent polling strategies, delta-based
                notifications, persistent state management, and AI insights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    400M+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Revenue Tracked
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    3,807
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Total Orders
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    Real-Time
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    WebSocket + Polling
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Features */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Core Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: "WebSocket Real-Time Notifications",
                description:
                  "Instant delta-based notifications with auto-fallback to 30s polling.",
                icon: "🔌",
              },
              {
                title: "Smart Polling Strategy",
                description:
                  "30s dashboard, 60s sales, on-demand AI insights for optimal performance.",
                icon: "⚡",
              },
              {
                title: "Persistent State Management",
                description:
                  "localStorage persistence for notifications & preferences across sessions.",
                icon: "💾",
              },
              {
                title: "Notification Preferences",
                description:
                  "User control over alert types, sound, and email notifications.",
                icon: "🔔",
              },
              {
                title: "Regional Analytics",
                description:
                  "Monitor performance across regions with revenue & order breakdowns.",
                icon: "🌍",
              },
              {
                title: "AI Chat Insights",
                description:
                  "Ask AI questions about sales, trends, and business performance.",
                icon: "🤖",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Built With
            </h2>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-lg sm:text-xl">
                      ▲
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    Next.js 14
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Framework
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      TS
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    TypeScript
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Safety
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      TW
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    Tailwind CSS
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Styling
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      📊
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    Recharts
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Charts
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-600 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      🔌
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    WebSocket
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Real-time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Fetching Strategy */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Smart Data Fetching
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-2 border-red-200 dark:border-red-800 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl">🔌</span>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    WebSocket - Instant
                  </h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>📢 Notifications (delta-based)</li>
                  <li>Auto-reconnect with backoff</li>
                  <li>Fallback to 30s polling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    Smart Polling
                  </h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>📊 Dashboard: 30s</li>
                  <li>📈 Sales: 60s</li>
                  <li>🤖 Insights: On-Demand</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Project Structure */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Project Structure
            </h2>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <CardContent className="p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm overflow-x-auto">
              <pre className="leading-relaxed">{`📁 cyfalytics/
│
├── 📁 src/app/
│   ├── 📁 dashboard/
│   │   ├── 📄 page.tsx                 → Dashboard (30s polling)
│   │   ├── 📁 sales/
│   │   │   └── 📄 page.tsx             → Sales Analytics (30-60s)
│   │   ├── 📁 insights/
│   │   │   └── 📄 page.tsx             → AI Insights (On-Demand)
│   │   ├── 📁 notifications/
│   │   │   └── 📄 page.tsx             → Notifications (WebSocket)
│   │   ├── 📁 readme/
│   │   │   └── 📄 page.tsx             → Documentation
│   │   └── 📁 components/
│   │       ├── 📄 NotificationBell.tsx → Synced Bell Dropdown
│   │       ├── 📄 OverviewCard.tsx
│   │       ├── 📄 RevenueChart.tsx
│   │       └── 📄 AIPredictionTable.tsx
│   │
│   └── 📁 api/
│       ├── 📁 sales/
│       │   └── 📄 route.ts
│       ├── 📁 sales-ws/
│       │   └── 📄 route.ts             → WebSocket endpoint
│       ├── 📁 transactions/
│       │   └── 📄 route.ts
│       └── 📁 ai/
│           └── 📄 route.ts
│
├── 📁 components/
│   └── 📁 ui/
│       ├── 📄 card.tsx
│       ├── 📄 button.tsx
│       └── 📄 badge.tsx
│       └── 📄 switch.tsx
│       ├── 📄 label.tsx
│       └── 📄 dropdown-menu.tsx      
│       └── 📄 toast.tsx    
│       └── 📄 toaster.tsx
│
├── 📁 lib/
│   └── 📄 utils.ts
│
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
└── 📄 package.json`}</pre>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              What&apos;s Implemented?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-l-4 border-l-green-500 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    Production Ready ✅
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>✅ WebSocket with auto-reconnect</li>
                  <li>✅ Delta-based notifications</li>
                  <li>✅ Smart polling strategy</li>
                  <li>✅ localStorage persistence</li>
                  <li>✅ Notification preferences UI</li>
                  <li>✅ Sound alerts</li>
                  <li>✅ Toast notifications</li>
                  <li>✅ Synced Bell + Full page</li>
                  <li>✅ AI chat with dynamic data</li>
                  <li>✅ Dark mode support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    Future Enhancements
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>🔜 Database integration</li>
                  <li>🔜 Email notifications</li>
                  <li>🔜 Mobile app</li>
                  <li>🔜 Advanced analytics</li>
                  <li>🔜 Export to PDF</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Improvements */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Key Technical Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Delta Detection",
                desc: "Only generates notifications on actual data changes, preventing spam",
              },
              {
                title: "Resource Efficient",
                desc: "WebSocket for critical, polling for secondary, on-demand for heavy ops",
              },
              {
                title: "Cross-Tab Sync",
                desc: "localStorage events sync state across multiple browser tabs in real-time",
              },
              {
                title: "Error Resilience",
                desc: "Automatic fallback from WebSocket to polling with exponential backoff",
              },
              {
                title: "User Preferences",
                desc: "Respects user settings for notifications, sound, and alert types",
              },
              {
                title: "Type Safe",
                desc: "Full TypeScript implementation for reliability and developer experience",
              },
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer - DYNAMIC VERSION */}
        <div className="text-center py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
            Built with production-grade practices and modern web standards
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <span>
              Version <strong className="font-mono">2.0.0</strong>
            </span>
            <span>•</span>

            <span>
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
            <span>•</span>
            <span className="font-mono text-blue-700 dark:text-cyan-400">
              Cyfalytics<span className="dark:text-white">.io</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
