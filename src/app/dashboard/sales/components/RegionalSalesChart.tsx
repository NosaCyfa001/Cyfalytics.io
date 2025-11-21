"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { salesByRegion } from "@/app/data/mockData";
import { RegionalSalesTable } from "./RegionalSalesTable";

interface RegionalData {
  name: string;
  value: number;
  [key: string]: any;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

export function RegionalSalesChart() {
  // Map the data for Recharts
  const regionalData: RegionalData[] = salesByRegion.map((item) => ({
    name: item.region,
    value: item.orders,
  }));

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

  const CustomTooltip = ({ active, payload }: PieTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {payload[0].value.toLocaleString()} orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Regional Sales Distribution
        </h2>
        <div className="flex justify-center h-72">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={regionalData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {regionalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <br />
        <RegionalSalesTable />
      </CardContent>
    </Card>
  );
}