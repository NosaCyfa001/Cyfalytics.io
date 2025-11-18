"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { dashboardChartData } from "@/app/data/mockData";

export function TrafficChart() {
  // ✅ Dynamically generate months (Jan → current month)
  const months = useMemo(() => {
    const now = new Date();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return monthNames.slice(0, now.getMonth() + 1);
  }, []);

  // ✅ Generate mock data for each month
  const data = months.map((month, i) => ({
    month,
    sales: 300 + Math.floor(Math.random() * 300),
    customers: 200 + Math.floor(Math.random() * 200),
  }));

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Sales vs Customers
        </h2>

        {/* ✅ Scrollable container for mobile */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#37415130" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "8px",
                    border: "none",
                    color: "white",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: "13px", color: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={false}
                  name="Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
