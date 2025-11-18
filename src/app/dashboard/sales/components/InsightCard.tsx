"use client";

import { Card, CardContent } from "@/components/ui/card";

// Define a proper interface for better type safety
interface InsightCardProps {
  icon: React.ElementType; // Use React.ElementType for LucideIcon props
  title: string;
  color: "blue" | "green" | "yellow"; // Restrict color options
  value: string | number;
  desc: string;
}

export function InsightCard({ icon: Icon, title, color, value, desc }: InsightCardProps) {
  
  // Define the full set of Tailwind classes for each color key
  const colorMap: Record<InsightCardProps['color'], {
    bg: string;
    text: string;
    border: string;
  }> = {
    blue: {
      // Full classes defined for Tailwind's JIT/scanning
      bg: "from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900",
      text: "text-blue-600 dark:text-indigo-400",
      border: "border-blue-200 dark:border-gray-700",
    },
    green: {
      bg: "from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900",
      text: "text-green-600 dark:text-emerald-400",
      border: "border-green-200 dark:border-gray-700",
    },
    yellow: {
      bg: "from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900",
      text: "text-amber-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-gray-700",
    },
  };

  const selectedColor = colorMap[color];

  return (
    <Card
      // Use the full class string from the map for background and border
      className={`bg-gradient-to-br ${selectedColor.bg} border ${selectedColor.border} rounded-2xl transition-shadow hover:shadow-lg`}
    >
      <CardContent className="p-5">
        
        {/* Use the full class string for text color */}
        <div className={`flex items-center gap-3 mb-2 ${selectedColor.text}`}>
          <Icon size={20} />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 font-medium text-xl">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      </CardContent>
    </Card>
  );
}