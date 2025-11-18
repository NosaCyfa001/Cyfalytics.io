"use client";

import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";
import { OverviewCard } from "./OverviewCard";

export default function OverviewGrid() {
  const stats = [
    {
      title: "Total Sales",
      value: "₦1.2M",
      icon: TrendingUp,
      change: "+8.4%",
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "₦4.5M",
      icon: DollarSign,
      change: "+5.2%",
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: "3,245",
      icon: Users,
      change: "+3.1%",
      color: "bg-purple-500",
    },
    {
      title: "Growth Rate",
      value: "12.7%",
      icon: BarChart3,
      change: "+1.6%",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
      {stats.map((stat, i) => (
        <OverviewCard key={i} {...stat} delay={i * 0.50} />
      ))}
    </div>
  );
}
