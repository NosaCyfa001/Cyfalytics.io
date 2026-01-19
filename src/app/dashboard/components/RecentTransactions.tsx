"use client";

import { useEffect, useState } from "react";
import {
  generateTransactions,
  buildMonthlyAnalytics,
  addForecast,
  Transaction,
} from "@/lib/analytics";
import { SalesChart } from "@/components/SalesChart";
import { RecentTransactions } from "@/components/RecentTransactions";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const regenerate = () => {
    const tx = generateTransactions();
    const monthly = buildMonthlyAnalytics(tx);
    setTransactions(tx);
    setChartData(addForecast(monthly));
  };

  useEffect(() => {
    regenerate();
    const id = setInterval(regenerate, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SalesChart data={chartData} />
      </div>
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
