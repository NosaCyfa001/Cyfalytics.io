"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, RefreshCw, Download } from "lucide-react";

export function SalesTrendChart() {
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/trend");
      const data = await res.json();

      // 🧠 Filter months up to current month only
      const currentMonthIndex = new Date().getMonth(); // 0-based
      const filtered = data.salesTrend.slice(0, currentMonthIndex + 1);

      setSalesTrend(filtered);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching sales trend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
    const interval = setInterval(fetchSalesData, 10_000); // every 10s
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => `₦${(val / 1_000_000).toFixed(0)}M`;

  // CSV Download Function
  const downloadCSV = () => {
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const totalSales = salesTrend.reduce((sum, s) => sum + s.sales, 0);
    const avgSales = salesTrend.length ? totalSales / salesTrend.length : 0;

    const headers = [
      "# Cyfalytics.io - Monthly Sales Trend Report",
      `# Generated: ${dateStr} at ${timeStr}`,
      `# Export Timestamp: ${timestamp}`,
      `# Total Sales (YTD): ₦${totalSales.toLocaleString()}`,
      `# Average Monthly: ${formatCurrency(avgSales)}`,
      `# Months Included: ${salesTrend.length}`,
      "",
      "Month,Sales (₦),Sales (Formatted)",
    ].join("\n");

    const rows = salesTrend
      .map(
        (item) =>
          `${item.month} 2025,${item.sales},"₦${item.sales.toLocaleString()}"`
      )
      .join("\n");

    const csvContent = headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `sales_trend_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {label} 2025
          </p>
          <p className="text-base font-bold text-blue-600 dark:text-blue-400">
            ₦{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalSales = salesTrend.reduce((sum, s) => sum + s.sales, 0);
  const avgSales = salesTrend.length ? totalSales / salesTrend.length : 0;

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Monthly Sales Trend
        </h2>
        <div className="flex items-center gap-2">
          {/* CSV Download Button */}
          <button
            onClick={downloadCSV}
            disabled={loading || salesTrend.length === 0}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r  from-blue-600 to-sky-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {loading ? (
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Updating...
              </span>
            ) : (
              <span>
                Updated{" "}
                {lastUpdated?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Responsive scroll container for smaller screens */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <div className="min-w-[500px] h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(0)}M`}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorSales)"
                  dot={{ fill: "#3b82f6", r: 3 }}
                  activeDot={{ r: 6, fill: "#2563eb" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Total Sales (YTD)
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ₦{totalSales.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Average Monthly</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(avgSales)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
