"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  MapPin,
  Award,
  RefreshCw,
} from "lucide-react";
import { OverviewCard } from "../components/OverviewCard";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { CategoryRevenueChart } from "./components/CategoryRevenueChart";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// --- START TYPE DEFINITIONS ---

interface SalesData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  regions: Array<{
    region: string;
    revenue: number;
    orders: number;
    topProduct: string;
  }>;
  timestamp: string;
}

// Type for the Recharts Pie label payload (FIXES TypeScript error)
interface PieLabelPayload {
  name: string;
  value: number;
  percent: number; // Recharts adds this calculated property
  cx: number;
  cy: number;
  // ... other Recharts internal props
}

// --- END TYPE DEFINITIONS ---

// --- START LOADING SKELETON COMPONENT ---

const SalesPageSkeleton = () => (
  <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
    {/* Header/Title Skeleton */}
    <div className="pt-2 flex justify-between items-center">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        ></div>
      ))}
    </div>

    {/* Charts Section Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Sales Trend Chart Skeleton (Placeholder for other charts) */}
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
    </div>

    {/* Regional Sales Chart & Table Skeleton (Large Area) */}
    <div className="h-[700px] lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
  </div>
);

// --- END LOADING SKELETON COMPONENT ---

export default function SalesPage() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bestCategory, setBestCategory] = useState<string>("N/A");

  useEffect(() => {
    // Load both sales and category data on mount and refresh periodically
    fetchSalesData();
    fetchBestCategory();
    const interval = setInterval(() => {
      fetchSalesData();
      fetchBestCategory();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSalesData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/sales");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSalesData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch latest category breakdown and pick the top category
  const fetchBestCategory = async () => {
    try {
      const res = await fetch("/api/sales/category");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      const monthly = data.monthlyCategoryData;
      if (Array.isArray(monthly) && monthly.length > 0) {
        const latest = monthly[monthly.length - 1];
        const cats = Array.isArray(latest.categories) ? latest.categories : [];
        if (cats.length > 0) {
          const top = cats.reduce((a: any, b: any) =>
            (b.revenue || 0) > (a.revenue || 0) ? b : a
          );
          setBestCategory(top.category || "N/A");
          return;
        }
      }
      setBestCategory("N/A");
    } catch (err) {
      console.error("Error fetching best category:", err);
      setBestCategory("N/A");
    }
  };

  // Calculate totals and top product
  const topProduct =
    salesData?.regions.reduce((prev, current) =>
      current.orders > prev.orders ? current : prev
    ).topProduct || "N/A";

  // Calculate top region (used in the InsightCard)
  const topRegionData = salesData?.regions.reduce((max, r) =>
    r.revenue > max.revenue ? r : max
  );
  const topRegionName = topRegionData?.region || "N/A";
  const topRegionPercentage = (
    ((topRegionData?.revenue || 0) / (salesData?.summary.totalRevenue || 1)) *
    100
  ).toFixed(0);

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

  const InsightCard = ({
    icon: Icon,
    title,
    color,
    value,
    desc,
  }: {
    icon: any;
    title: string;
    color: "blue" | "green" | "yellow";
    value: string;
    desc: string;
  }) => {
    const styles = {
      blue: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900",
        text: "text-blue-600 dark:text-indigo-400",
      },
      green: {
        bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900",
        text: "text-green-600 dark:text-emerald-400",
      },
      yellow: {
        bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900",
        text: "text-amber-600 dark:text-yellow-400",
      },
    };

    const currentStyle = styles[color];

    return (
      <Card
        className={`${currentStyle.bg} border border-gray-200 dark:border-gray-700 rounded-2xl`}
      >
        <CardContent className="p-5">
          <div className={`flex items-center gap-3 mb-2 ${currentStyle.text}`}>
            <Icon size={20} />
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <p className="text-gray-800 dark:text-gray-200 font-medium text-xl">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    // 💡 UPGRADE: Use the Skeleton Screen for better UX
    return <SalesPageSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sales Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time sales performance • Last updated:{" "}
            {salesData && new Date(salesData.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm">Live</span>
          </div>
          <button
            onClick={fetchSalesData}
            disabled={refreshing}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <OverviewCard
          title="Total Revenue"
          value={`₦${((salesData?.summary.totalRevenue || 0) / 1000000).toFixed(
            1
          )}M`}
          icon={DollarSign}
          color="from-green-500 to-emerald-700"
          change="+10.2%"
        />
        <OverviewCard
          title="Total Sales"
          value={salesData?.summary.totalOrders.toLocaleString() || "0"}
          icon={ShoppingBag}
          color="from-blue-500 to-indigo-700"
          change="+6.5%"
        />
        <OverviewCard
          title="Avg Order Value"
          value={`₦${((salesData?.summary.avgOrderValue || 0) / 1000).toFixed(
            0
          )}K`}
          icon={Users}
          color="from-pink-500 to-rose-700"
          change="+4.9%"
        />
        <OverviewCard
          title="Top Product"
          value={topProduct}
          icon={Star}
          color="from-yellow-500 to-amber-600"
          change="🔥 Bestseller"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SalesTrendChart />
        <CategoryRevenueChart />

        {/* Regional Sales Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Regional Sales Distribution
            </h2>

            {/* Pie Chart */}
            <div className="flex justify-center h-64 sm:h-72 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData?.regions.map((r) => ({
                      name: r.region,
                      value: r.orders,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry: { name?: string; percent?: number }) => {
                      const name = entry.name ?? "Unknown";
                      const pct =
                        typeof entry.percent === "number"
                          ? (entry.percent * 100).toFixed(0)
                          : "0";
                      return `${name} ${pct}%`;
                    }}
                  >
                    {salesData?.regions.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()} orders`,
                      "Orders",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Data Table */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Detailed Breakdown
              </h3>
              <div className="space-y-3">
                {salesData?.regions.map((region, index) => (
                  <div
                    key={region.region}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {region.region}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Top: {region.topProduct}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Revenue
                        </p>
                        <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                          ₦{(region.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Orders
                        </p>
                        <p className="text-base font-bold text-green-600 dark:text-green-400">
                          {region.orders.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <InsightCard
          icon={MapPin}
          title="Top Region"
          color="blue"
          // Corrected to show the name of the top region
          value={topRegionName}
          desc={`${topRegionName} is the leading region in total sales.`}
        />
        <InsightCard
          icon={Award}
          title="Best Category"
          color="green"
          value={bestCategory}
          desc={`Largest contributor to total revenue.`}
        />
        <InsightCard
          icon={Star}
          title="Top Product"
          color="yellow"
          value={topProduct}
          desc="Most purchased product this period."
        />
      </div>
    </div>
  );
}
