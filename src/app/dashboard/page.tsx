"use client";

import { useState, useEffect } from "react";
import { OverviewCard } from "./components/OverviewCard";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "./components/RevenueChart";

// --- START TYPE DEFINITIONS ---

interface SalesData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  regions: Array<{
    region: string;
    revenue: number;
    orders: number;
    topProduct: string;
  }>;
  timestamp: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  customer: string;
  status: "paid" | "pending" | "refunded";
  // Assuming the upgraded API now includes 'product' and 'paymentMethod'
  product?: string;
  paymentMethod?: string;
}

// Recharts Tooltip Payload Types
interface TooltipPayload {
  active: boolean;
  payload: Array<{
    value: number | string;
    name: string;
    color: string;
  }>;
  label: string;
}

// --- END TYPE DEFINITIONS ---

// --- START SKELETON SCREEN COMPONENT (For superior UX) ---

const DashboardPageSkeleton = () => (
  <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
    {/* Header/Title Skeleton */}
    <div className="pt-2 flex justify-between items-center">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        ></div>
      ))}
    </div>

    {/* Regional Performance Skeleton */}
    <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>

    {/* Charts and Transactions Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 h-72 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
    </div>

    {/* Sales vs Customers Chart Skeleton */}
    <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"></div>
  </div>
);

// --- END SKELETON SCREEN COMPONENT ---

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch sales and transactions in parallel
      const [salesRes, transactionsRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/transactions"),
      ]);

      if (!salesRes.ok || !transactionsRes.ok)
        throw new Error("Failed to fetch data");

      const [salesJson, transactionsJson] = await Promise.all([
        salesRes.json(),
        transactionsRes.json(),
      ]);

      setSalesData(salesJson);
      // Ensure transactions array exists in the API response structure
      setTransactions(transactionsJson.transactions || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An unknown error occurred.");
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Generate data from Jan to current month
  const generateMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const baseRevenue = 6400000;
    const baseSales = 350;
    const baseCustomers = 240;

    return months.slice(0, currentMonth + 1).map((month, index) => {
      const growthFactor = 1 + index * 0.15 * (Math.random() * 0.2 + 0.9); // Slight randomization for realism
      return {
        month,
        revenue: Math.round(baseRevenue * growthFactor),
        sales: Math.round(
          baseSales * (1 + index * 0.12 * (Math.random() * 0.2 + 0.9))
        ),
        customers: Math.round(
          baseCustomers * (1 + index * 0.14 * (Math.random() * 0.2 + 0.9))
        ),
      };
    });
  };

  const monthlyData = generateMonthlyData();
  const formatNaira = (value: number) => `₦${(value / 1_000_000).toFixed(1)}M`;

  // Custom Tooltip for the Revenue Chart
  const CustomTooltip = ({ active, payload, label }: TooltipPayload) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Revenue: ₦{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for the Sales vs Customers Chart
  const CustomMultiTooltip = ({ active, payload, label }: TooltipPayload) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "refunded":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (!mounted || loading) {
    // ✅ FIX: Using the upgraded Skeleton Screen for better UX
    return <DashboardPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-300 dark:border-red-700">
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Data Load Failed 😟
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {refreshing ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time business analytics • Last updated:{" "}
            {salesData && new Date(salesData.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm">Live</span>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <OverviewCard
          title="Total Revenue"
          value={`₦${((salesData?.summary.totalRevenue || 0) / 1000000).toFixed(
            1
          )}M`}
          icon={DollarSign}
          color="from-green-500 to-emerald-700"
          change="+12.4%"
        />
        <OverviewCard
          title="Total Orders"
          value={salesData?.summary.totalOrders.toLocaleString() || "0"}
          icon={ShoppingBag}
          color="from-blue-500 to-indigo-700"
          change="+5.3%"
        />
        <OverviewCard
          title="Avg Order Value"
          value={`₦${((salesData?.summary.avgOrderValue || 0) / 1000).toFixed(
            0
          )}K`}
          icon={Users}
          color="from-pink-500 to-rose-700"
          change="+8.1%"
        />
        <OverviewCard
          title="Active Regions"
          value={salesData?.regions.length.toString() || "0"}
          icon={Package}
          color="from-yellow-500 to-amber-600"
          change="2 regions"
        />
      </div>

      {/* Regional Performance */}
      {salesData && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Regional Performance
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {salesData.regions.map((region) => (
                <div
                  key={region.region}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="mb-3 sm:mb-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                      {region.region}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Top Product: {region.topProduct}
                    </p>
                  </div>
                  <div className="flex gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Revenue
                      </p>
                      <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                        ₦{(region.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Orders
                      </p>
                      <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                        {region.orders.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <RevenueChart />
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {" "}
              {/* Added max-height and scroll */}
              {transactions.slice(0, 10).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {txn.customer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ₦{txn.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        txn.status
                      )}`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales vs Customers */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Sales vs Active Customers
          </h2>
          <div className="h-64 sm:h-72 overflow-x-auto">
            <div style={{ minWidth: "500px", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37415120" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    content={
                      <CustomMultiTooltip
                        active={false}
                        payload={[]}
                        label={""}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
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
    </div>
  );
}
