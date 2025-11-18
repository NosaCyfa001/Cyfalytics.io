"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { salesByRegion } from "@/app/data/mockData";
import { RegionalSalesTable } from "./RegionalSalesTable";

export function RegionalSalesChart() {
  // Map the data for Recharts
  const regionalData = salesByRegion.map((item) => ({
    name: item.region,
    value: item.orders,
  }));

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

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
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value.toLocaleString()} orders`,
                  name,
                ]}
              />
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
