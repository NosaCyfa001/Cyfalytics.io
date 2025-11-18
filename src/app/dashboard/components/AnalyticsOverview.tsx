"use client";

import { OverviewCard } from "./OverviewCard";
import { RevenueChart } from "./RevenueChart";
import { TrafficChart } from "./TrafficChart";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

export function AnalyticsOverview() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard title="Total Revenue" value="₦86.8M" icon={DollarSign} color="from-green-500 to-emerald-700" change="+12.4%" />
        <OverviewCard title="Total Sales" value="2,340" icon={ShoppingBag} color="from-blue-500 to-indigo-700" change="+5.3%" />
        <OverviewCard title="Active Customers" value="1,890" icon={Users} color="from-pink-500 to-rose-700" change="+8.1%" />
        <OverviewCard title="Products in Stock" value="312" icon={Package} color="from-yellow-500 to-amber-600" change="-2.2%" />
      </div>

      {/* Charts */}
      <RevenueChart />
      <TrafficChart />
    </div>
  );
}
