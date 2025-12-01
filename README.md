Cyfalytics.io — Real-Time AI Analytics Dashboard
A modern, real-time analytics dashboard built with Next.js 14 (App Router), TailwindCSS, Recharts, and Clerk Authentication. Designed for Nigerian gadget stores, but adaptable to any business.
🌟 Overview
Cyfalytics.io is a fully responsive, AI-powered analytics dashboard that delivers:

📊 Real-time sales + revenue analytics (updates every 10 seconds)
🔄 Dynamic charts (Category Revenue, Sales Trend, Region Revenue)
📥 CSV Export (with timestamps)
🌙 Dark/Light Mode
📱 Fully responsive UI for all screens
🔐 Auth system using Clerk
🤖 AI Insights page (powered by OpenAI)
⚡ Zero database — data generated through API + client-side polling
🎨 Clean, modern UI with smooth interactions

🛠️ Tech Stack
Frontend

Next.js 14 (App Router)
React (with Hooks)
TailwindCSS
Recharts
Framer Motion
Clerk Auth

Backend (Inside Next.js)

REST API routes for dynamic data generation
Mock data generator (Node)

AI

OpenAI API for AI Insights page


⚡ Real-Time Architecture (Polling-Based)
This project simulates live analytics using client-side polling with a 10-second refresh interval.
Why Polling?

✅ Simple to implement — no complex WebSocket/SSE setup
✅ Reliable — works everywhere (no connection persistence issues)
✅ Efficient for 10s intervals — perfectly acceptable for dashboard use cases
✅ Easy to debug — standard HTTP requests

How it works

User opens the dashboard
useEffect hook triggers initial data fetch
setInterval calls the API every 10 seconds:

typescriptuseEffect(() => {
  setMounted(true);
  fetchData();
  const interval = setInterval(fetchData, 10000); // 10 seconds
  return () => clearInterval(interval);
}, []);

Charts update automatically with fresh data
No page refresh needed — feels real-time!


📊 Key Features
🔥 1. Real-Time Charts
Sales Trend (Jan → Current Month)

Automatically generates data up to today's month
Updates every 10 seconds
Scrollable on small screens

Revenue by Category

Power Banks
Airpods
Smart Watches
Phones
Laptops
Accessories
etc.

Region Revenue (Lagos vs Abuja)
Dynamic weights simulate realistic regional differences.

📥 2. CSV Export
Every chart can export CSV with:

Timestamp (date + time)
Source (sales/category/region)
Raw data values

Example:
csvexported_at,category,revenue
2025-01-06 14:32,Phones,120000000
2025-01-06 14:32,Laptops,98000000

🌙 3. Dark Mode + Clean UI
The entire dashboard is optimized for:

Smooth animations
Mobile friendliness
Elegant spacing
System theme preference


🔐 4. Authentication with Clerk
Sign in/out flows out of the box.

🤖 5. AI Insights Page
Uses OpenAI API to summarize metrics & answer business questions.
Examples:

"Why did sales drop in June?"
"Predict Lagos vs Abuja revenue for next quarter."


📡 API Routes
RouteMethodDescription/api/salesGETFetch current sales data/api/categoryGETFetch category revenue breakdown/api/regionGETFetch region-based revenue/api/chatPOSTAI Insights (OpenAI)/api/export/csvPOSTCSV export

🧱 Project Structure
src/
 ├─ app/
 │   ├─ dashboard/
 │   │   ├─ charts/
 │   │   ├─ layout.tsx
 │   │   ├─ page.tsx
 │   ├─ api/
 │   │   ├─ sales/route.ts
 │   │   ├─ category/route.ts
 │   │   ├─ region/route.ts
 │   │   ├─ chat/route.ts
 │   │   ├─ export/csv/route.ts
 │   ├─ layout.tsx
 │   ├─ page.tsx
 ├─ components/
 ├─ lib/
 ├─ styles/

🧪 Running Locally
bash.. git clone https://cyfalytics-io-rqg5.vercel.app/
cd cyfalytics
npm install
npm run dev
Open 👉 http://localhost:3000
