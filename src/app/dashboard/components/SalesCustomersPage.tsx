"use client";

import { useEffect, useMemo, useState } from "react";
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

/* ---------------- TYPES ---------------- */

type DataPoint = {
  month: string;
  sales: number;
  customers: number;
  conversion: number;
  forecast?: number;
};

/* ---------------- HELPERS ---------------- */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function rolling12Months(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i);
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  });
}

/* ---------------- COMPONENT ---------------- */

export default function SalesVsCustomersChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  /* -------- Generate realistic rolling data -------- */

  const generateData = () => {
    const months = rolling12Months();

    let baseCustomers = 420;
    let baseSales = 310;

    const generated: DataPoint[] = months.map((month, i) => {
      baseCustomers += Math.round(Math.random() * 30 - 10);
      baseSales += Math.round(Math.random() * 25 - 8);

      baseCustomers = Math.max(baseCustomers, baseSales + 30);

      const conversion = +(baseSales / baseCustomers * 100).toFixed(1);

      return {
        month,
        sales: baseSales,
        customers: baseCustomers,
        conversion,
      };
    });

    /* -------- Forecast next 3 months -------- */
    const last6 = generated.slice(-6);
    const avgGrowth =
      last6.reduce((a, c, i, arr) => {
        if (i === 0) return a;
        return a + (c.sales - arr[i - 1].sales) / arr[i - 1].sales;
      }, 0) / (last6.length - 1);

    let forecastSales = generated[generated.length - 1].sales;

    generated.forEach((d, i) => {
      if (i >= generated.length - 3) {
        forecastSales = Math.round(forecastSales * (1 + avgGrowth));
        d.forecast = forecastSales;
      }
    });

    setData(generated);
  };

  /* -------- Auto refresh every 10s -------- */

  useEffect(() => {
    generateData();
    const id = setInterval(generateData, 10_000);
    return () => clearInterval(id);
  }, []);

  /* -------- Retention / churn (estimate) -------- */

  const retention = useMemo(() => {
    if (data.length < 2) return 0;
    const prev = data[data.length - 2].customers;
    const curr = data[data.length - 1].customers;
    return +(curr / prev * 100).toFixed(1);
  }, [data]);

  const churn = +(100 - retention).toFixed(1);

  /* ---------------- UI ---------------- */

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Sales vs Active Customers (Rolling 12 Months)
        </h2>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Conversion • Retention • Forecast
        </p>

        <div className="h-72 overflow-x-auto">
          <div className="min-w-[700px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#37415120" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: "8px",
                    border: "none",
                    color: "#fff",
                  }}
                />

                <Legend wrapperStyle={{ fontSize: 12 }} />

                {/* Sales */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                />

                {/* Customers */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="customers"
                  name="Customers"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={false}
                />

                {/* Conversion */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversion"
                  name="Conversion %"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />

                {/* Forecast */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="forecast"
                  name="Sales Forecast"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention / Churn */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="text-green-600 dark:text-green-400">
            Retention: <strong>{retention}%</strong>
          </div>
          <div className="text-red-600 dark:text-red-400">
            Churn: <strong>{churn}%</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
