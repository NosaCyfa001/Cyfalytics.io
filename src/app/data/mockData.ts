// 🛍️ Dashboard — high-level stats
export const dashboardStats = {
  totalRevenue: 24500,
  totalOrders: 1280,
  avgOrderValue: 76.5,
  returningCustomers: 420,
};

// 📊 Dashboard chart — Monthly sales & customers
export const dashboardChartData = [
  { month: "Jan", sales: 4800, customers: 220 },
  { month: "Feb", sales: 5250, customers: 340 },
  { month: "Mar", sales: 6100, customers: 380 },
  { month: "Apr", sales: 7200, customers: 420 },
  { month: "May", sales: 6800, customers: 446 },
  { month: "Jun", sales: 7600, customers: 457 },
  { month: "Jul", sales: 8100, customers: 460 },
  { month: "Aug", sales: 7900, customers: 455 },
  { month: "Sep", sales: 8500, customers: 480 },
  { month: "Oct", sales: 9200, customers: 575 },
  { month: "Nov", sales: 9800, customers: 609 },
  { month: "Dec", sales: 11000, customers: 680 },
];

// 💰 Sales page — detailed region data
export const salesByRegion = [
  { region: "Lagos", revenue: 1368072000, orders: 1750 },
  { region: "Abuja", revenue: 756700, orders: 805 },
];

// 🤖 AI Insights page — predicted trends (Nigerian Market)
// Sales figures are in Millions of Naira (₦M)
export const aiPredictions = [
  {
    month: "Nov 2025",
    projectedSales: 375080000, // Building up to Black Friday/Christmas.
    growthRate: "+7.5%",
  },
  {
    month: "Dec 2025",
    projectedSales: 394000000, // Peak sales driven by Christmas/New Year spending.
    growthRate: "+24.7%",
  },
  {
    month: "Jan 2026",
    projectedSales: 268000000, // Significant post-holiday dip is normal.
    growthRate: "-28.1%",
  },
  {
    month: "Feb 2026",
    projectedSales: 272000000, // Slight recovery begins.
    growthRate: "+6.6%",
  },
  {
    month: "Mar 2026",
    projectedSales: 179000000, // Growth normalizing toward monthly average.
    growthRate: "+9.1%",
  },
];