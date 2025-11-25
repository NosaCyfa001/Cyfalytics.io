"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useMemo } from "react";

export function RevenueChart() {
  const months = useMemo(() => {
    const now = new Date();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return monthNames.slice(0, now.getMonth() + 1);
  }, []);

  const data = months.map((month) => ({
    month,
    revenue: 100_000_000 + Math.floor(Math.random() * 300_000_000),
  }));

  const formatNaira = (value: number) => `₦${(value / 1_000_000).toFixed(1)}M`;

  const handleDownloadCSV = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const headers = ["Month", "Revenue (₦)"];
    const rows = data.map((item) => [item.month, item.revenue.toString()]);
    const metadata = [`Export Date: ${now.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [metadata, [""], headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_data_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Tooltip component for clean display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload[0].value;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px] text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {label}
          </p>
          <p className="text-base text-blue-600 dark:text-indigo-400 font-bold">
            {`₦${revenue.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Revenue Trend (₦)
          </h2>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>

        {/* Chart Section */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#37415130" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={formatNaira} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
