"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  change?: string;
  delay?: number;
}

export function OverviewCard({
  title,
  value,
  icon: Icon,
  color = "from-blue-500 to-blue-700",
  change,
  delay = 0,
}: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-5">
          {/* Icon and Badge Row */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${color}`}>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            {change && (
              <span
                className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
                  change.startsWith("+")
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : change.startsWith("-")
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {change}
              </span>
            )}
          </div>

          {/* Value */}
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1 truncate">
            {value}
          </p>

          {/* Title */}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}