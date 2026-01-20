"use client";

import { Card } from "@/components/ui/card";

// ✅ Define proper type instead of 'any'
interface MonthData {
  month: string;
  revenue: number;
  isForecast?: boolean;
}

interface SalesChartProps {
  data: MonthData[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sales & Revenue</h3>
      <div className="h-64 flex items-center justify-center text-gray-400">
        {data.length > 0 ? (
          <div className="w-full">
            <p className="text-sm mb-4">Monthly Revenue Overview</p>
            <div className="space-y-2">
              {data.slice(0, 5).map((month) => (
                <div key={month.month} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">{month.month}</span>
                  <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        month.isForecast ? "bg-blue-400" : "bg-blue-600"
                      }`}
                      style={{
                        width: `${(month.revenue / (data[0]?.revenue || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-20 text-right">
                    ${(month.revenue / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Card>
  );
}