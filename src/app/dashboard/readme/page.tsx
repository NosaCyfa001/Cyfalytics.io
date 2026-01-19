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
              Next.js 14 • TypeScript • Tailwind CSS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight px-4">
            Cyfalytics.io
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            A modern analytics dashboard for tracking sales performance, revenue
            trends, and business metrics in real-time.
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
                Cyfalytics.io is a full-stack analytics platform designed to
                give businesses actionable insights into their sales data. Built
                with cutting-edge web technologies, it combines beautiful UI
                with powerful data visualization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    100M+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Revenue Tracked
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    1,280
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Total Orders
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    10s
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Live Updates
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
                title: "Real-Time Analytics",
                description:
                  "Dashboard auto-refreshes every 10 seconds with the latest sales data and metrics.",
                icon: "📊",
              },
              {
                title: "Rolling 12-Month Trends",
                description:
                  "Track revenue and sales patterns over the last year with dynamic charts.",
                icon: "📈",
              },
              {
                title: "Regional Insights",
                description:
                  "Monitor performance across different regions with detailed breakdowns.",
                icon: "🌍",
              },
              {
                title: "Transaction History",
                description:
                  "View recent transactions with status tracking and customer details.",
                icon: "💳",
              },
              {
                title: "CSV Export",
                description:
                  "Download your data in CSV format with timestamps and formatting.",
                icon: "⬇️",
              },
              {
                title: "Dark Mode",
                description:
                  "Full dark mode support for comfortable viewing in any environment.",
                icon: "🌙",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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
                    React Framework
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">TS</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    TypeScript
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Type Safety
                  </p>
                </div>

                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">TW</span>
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
                    <span className="text-white font-bold text-lg sm:text-xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    Recharts
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Visualizations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Start */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Quick Start
            </h2>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    step: "01",
                    title: "Clone Repository",
                    code: "git clone https://github.com/NosaCyfa001/Cyfalytics.io.git",
                  },
                  {
                    step: "02",
                    title: "Install Dependencies",
                    code: "npm install",
                  },
                  {
                    step: "03",
                    title: "Run Development Server",
                    code: "npm run dev",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <div className="bg-gray-900 dark:bg-black rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto">
                        $ {item.code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100 mb-1">
                      Open your browser
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                      Navigate to{" "}
                      <code className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-900 rounded font-mono text-xs">
                        http://localhost:3000
                      </code>{" "}
                      to see your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Project Structure */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
              <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Project Structure
            </h2>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <CardContent className="p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm overflow-x-auto">
              <pre className="leading-relaxed">{`📁 cyfalytics/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 page.tsx          → Main Dashboard
│   │   │   ├── 📁 sales/            → Sales Analytics
│   │   │   ├── 📁 insights/         → AI Insights
│   │   │   ├── 📁 readme/           → Documentation
│   │   │   └── 📁 components/       → Shared Components
│   │   │
│   │   └── 📁 api/                  → API Routes
│   │       ├── 📁 sales/
│   │       └── 📁 transactions/
│   │
│   ├── 📁 components/ui/            → UI Components
│   └── 📁 lib/                      → Utilities
│
├── 📄 package.json
├── 📄 tailwind.config.ts
└── 📄 tsconfig.json`}</pre>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              What&apos;s Next?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-l-4 border-l-green-500 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    Completed
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>✅ Dashboard UI & Charts</li>
                  <li>✅ Real-time data updates</li>
                  <li>✅ User authentication</li>
                  <li>✅ Dark mode support</li>
                  <li>✅ CSV export functionality</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                    Coming Soon
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <li>🔜 Database integration</li>
                  <li>🔜 Advanced filtering</li>
                  <li>🔜 Mobile app</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
            Made with 💙 by the Cyfalytics.io Team
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            Version 1.0.0 • Last updated January 2026
          </p>
        </div>
      </div>
    </div>
  );
}