🚀 Cyfalytics.io — Real-Time AI Analytics Dashboard

A modern, high-performance analytics dashboard built with Next.js 14, TailwindCSS, Recharts, Clerk Auth, and OpenAI AI Insights.
Designed originally for Nigerian gadget retailers, but fully adaptable to any business.

Cyfalytics.io delivers beautiful charts, real-time data simulation, AI-powered insights, CSV exporting, and a clean, responsive UI.

✨ Features
📊 Real-Time Analytics (10-second polling)

Sales trend chart 

Category revenue (Phones, Laptops, Power Banks, Smart Watches, etc.)

Lagos vs Abuja region revenue

All charts live-update every 10 seconds

🧠 AI Insights (OpenAI Powered)

Ask natural-language questions:

“Why did revenue increase this month?”

“Predict Lagos sales for next quarter”

“Which product category is underperforming?”

📥 CSV Export (with timestamps)

Export any chart’s dataset with fields:

exported_at, category, revenue
2025-01-06 14:32, Phones, 120000000

🌙 Dark/Light Mode

Auto-detects system theme
Smooth transitions
Clean UI/UX

📱 Fully Responsive

Optimized for:

Desktop dashboards

Tablets

Mobile scrolling charts (horizontal scroll built-in)

🔐 Authentication

Powered by Clerk (sign-in, sign-out, routing protection)

⚙️ Zero Database

All analytics data is generated dynamically via API routes.

🛠️ Tech Stack
Frontend

Next.js 14 (App Router)

React 18 + Hooks

TailwindCSS

Recharts (interactive charts)

Framer Motion (animations)

Clerk Authentication

Backend

Next.js API Routes

TypeScript

Mock data generators

CSV generation API

AI

OpenAI (gpt-4o-mini)

⚡ Real-Time Architecture (Polling Strategy)

Instead of WebSockets or SSE, Cyfalytics.io uses client-side polling:

Why Polling?

Works everywhere (no persistent connection issues)

Zero server complexity

Perfect for 10-second intervals

Easy to scale on Vercel

Simple debugging

How It Works
useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, 10000);
  return () => clearInterval(interval);
}, []);


Charts update automatically without page refresh.

📡 API Routes
Route	Method	Purpose
/api/sales	GET	Monthly sales trend
/api/category	GET	Category revenue data
/api/region	GET	Lagos vs Abuja simulation
/api/api-keys	POST	AI Insights (OpenAI)
/api/export/csv	POST	CSV export with timestamp
📁 Full Project Structure

(Updated to match your real files — NOT generic)

src/
├─ app/
│  ├─ api/
│  │  ├─ sales/route.ts
│  │  ├─ category/route.ts
│  │  ├─ region/route.ts
│  │  ├─ chat/route.ts
│  │
│  ├─ dashboard/
│  │  ├─ components/
│  │  │  ├─ CategoryRevenueChart.tsx
│  │  │  ├─ RegionRevenueChart.tsx
│  │  │  ├─ SalesTrendChart.tsx
│  │  │  
│  │  ├─ page.tsx
│  │  └─ layout.tsx
│  ├─ ai/
│  │  └─ page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ ui/
│     ├─ card.tsx
│     ├─ button.tsx
│     └─ input.tsx
├─ lib/
│  └─ utils.ts
├─ styles/
│  └─ globals.css

🚀 Deployment (Vercel)
1️⃣ Push to GitHub
git add .
git commit -m "Deploy build"
git push origin main

2️⃣ Go to Vercel.com → New Project
3️⃣ Import your GitHub repo
4️⃣ Add Environment Variables

Under Project → Settings → Environment Variables

Key	Value
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY	from Clerk
CLERK_SECRET_KEY	from Clerk
OPENAI_API_KEY	from OpenAI

Click Redeploy.

🧪 Run Locally
git clone https://github.com/YOUR_USERNAME/Cyfalytics.io.git
cd cyfalytics
npm install
npm run dev


Visit:
👉 http://localhost:3000
