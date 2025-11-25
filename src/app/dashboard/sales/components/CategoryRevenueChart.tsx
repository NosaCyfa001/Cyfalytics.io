"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCw, Download } from "lucide-react";

interface CategoryData {
  category: string;
  revenue: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CategoryData;
  }>;
}

export function CategoryRevenueChart() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/category");
      const data = await res.json();

      // 🧠 Only include data up to current month
      const latestMonthData =
        data.monthlyCategoryData[data.monthlyCategoryData.length - 1];
      setCategoryData(latestMonthData.categories);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching category data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
    const interval = setInterval(fetchCategoryData, 10_000); // refresh every 10 s
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => `₦${val.toLocaleString("en-NG")}`;

  // CSV Download Function
  const downloadCSV = () => {
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = new Date().toLocaleTimeString('en-NG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const totalRevenue = categoryData.reduce((sum, item) => sum + item.revenue, 0);

    const headers = [
      '# Cyfalytics.io - Revenue by Category Report',
      `# Generated: ${dateStr} at ${timeStr}`,
      `# Export Timestamp: ${timestamp}`,
      `# Total Revenue: ₦${totalRevenue.toLocaleString()}`,
      `# Categories: ${categoryData.length}`,
      '',
      'Category,Revenue (₦),Revenue (Formatted),Percentage'
    ].join('\n');

    const rows = categoryData.map(item => {
      const percentage = ((item.revenue / totalRevenue) * 100).toFixed(1);
      return `${item.category},${item.revenue},"₦${item.revenue.toLocaleString()}",${percentage}%`;
    }).join('\n');

    const csvContent = headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `category_revenue_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Revenue by Category
        </h2>
        <div className="flex items-center gap-2">
          {/* CSV Download Button */}
          <button
            onClick={downloadCSV}
            disabled={loading || categoryData.length === 0}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {loading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> Updating…
              </>
            ) : (
              <>Updated {lastUpdated?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Scrollable for smaller screens */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <div className="min-w-[650px] h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(0)}M`}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
