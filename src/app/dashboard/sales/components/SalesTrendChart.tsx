"use client";

import { JSX, useEffect, useState } from "react";
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
import { RefreshCw, Download } from "lucide-react";

type SalesPoint = {
  month: string; // short month name e.g. "Jan"
  sales: number; // raw ₦ value (integer)
};

type TrendApiResponse = {
  salesTrend: SalesPoint[];
};

type TooltipPayload = {
  value: number;
  payload?: SalesPoint;
};

export function SalesTrendChart(): JSX.Element {
  const [salesTrend, setSalesTrend] = useState<SalesPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const POLL_INTERVAL_MS = 10_000; // 10s

  async function fetchSalesTrend(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/trend");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as TrendApiResponse;
      const currentMonthIndex = new Date().getMonth(); // 0-based
      const filtered = (data.salesTrend ?? []).slice(0, currentMonthIndex + 1);
      setSalesTrend(filtered);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("fetchSalesTrend error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSalesTrend();
    const id = setInterval(fetchSalesTrend, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const totalSales = salesTrend.reduce((sum, s) => sum + (s.sales ?? 0), 0);
  const avgSales = salesTrend.length ? Math.round(totalSales / salesTrend.length) : 0;

  const formatCurrency = (val: number): string => `₦${(val / 1_000_000).toFixed(0)}M`;

  // CSV Export
  function downloadCSV(): void {
    const iso = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const headers = [
      "# Cyfalytics.io - Monthly Sales Trend Report",
      `# Generated: ${dateStr} at ${timeStr}`,
      `# Export Timestamp: ${iso}`,
      `# Total Sales (YTD): ₦${totalSales.toLocaleString()}`,
      `# Average Monthly: ${formatCurrency(avgSales)}`,
      `# Months Included: ${salesTrend.length}`,
      "",
      "Month,Sales (₦),Sales (Formatted)",
    ].join("\n");

    const rows = salesTrend
      .map((item) => `${item.month} ${new Date().getFullYear()},${item.sales},"₦${item.sales.toLocaleString()}"`)
      .join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyfalytics_sales_trend_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function CustomTooltip({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }): JSX.Element | null {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label} {new Date().getFullYear()}</p>
          <p className="text-base font-bold text-blue-600 dark:text-blue-400">₦{item.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Sales Trend</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCSV}
            disabled={loading || salesTrend.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-medium shadow-sm hover:opacity-95 disabled:opacity-50"
            aria-label="Export sales CSV"
          >
            <Download className="w-4 h-4" />
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
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(0)}M`} style={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Sales (YTD)</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">₦{totalSales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Average Monthly</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(avgSales)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
