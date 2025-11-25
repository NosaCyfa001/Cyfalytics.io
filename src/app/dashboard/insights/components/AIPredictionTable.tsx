"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, ArrowUpRight, RefreshCw, Currency } from "lucide-react";

interface Prediction {
  month: string;
  projectedSales: number;
  growthRate: string;
}

export function AIPredictionTable() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generatePredictions();
    // Refresh predictions every 10 seconds
    const interval = setInterval(generatePredictions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Utility to format Naira to Millions (₦100M)
  const formatNaira = (value: number) => {
    const millions = (value / 1_000_000).toFixed(1);
    return `₦${millions}M`;
  };

  const generatePredictions = () => {
    setRefreshing(true);

    const fullMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const currentDate = new Date();
    // Start predictions from the next month
    let currentMonthIndex = (currentDate.getMonth() + 1) % 12;
    let currentYear = currentDate.getFullYear();
    
    const numberOfMonths = 6; // Predict for the next 6 months
    
    // Set a much higher base sales figure (e.g., ₦150 Million)
    const baseSales = 150_000_000;

    const newPredictions: Prediction[] = [];
    
    for (let i = 0; i < numberOfMonths; i++) {
        // Increment year if month index wraps around (e.g., Dec to Jan)
        if (currentMonthIndex === 0 && i > 0) {
            currentYear += 1;
        }

        const monthName = fullMonths[currentMonthIndex];
        const monthYear = `${monthName} ${currentYear}`; // New format

        // Base growth: start at 1.0 (0% growth) and increase by 8% each month
        const baseGrowth = 1 + (i * 0.08); 
        // Add some noise (randomness) for realistic AI predictions
        const noise = (Math.random() * 0.05 - 0.025); // Range: -2.5% to +2.5%
        
        const growthFactor = baseGrowth + noise;
        const projectedSales = Math.round(baseSales * growthFactor);
        
        // Calculate the growth rate relative to the base sales (first month's sales)
        const growthRateValue = (projectedSales / baseSales) * 700 ;
        const growthRate = `${growthRateValue >= 0 ? '+' : ''}${growthRateValue.toFixed(1)}%`;

        newPredictions.push({
            month: monthYear,
            projectedSales,
            growthRate,
        });

        // Move to the next month
        currentMonthIndex = (currentMonthIndex + 1) % 12;
    }

    setPredictions(newPredictions);
    // Simulate a brief API loading time
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">    
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                AI Sales Predictions
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Forecasted revenue for the next 6 months
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Live</span>
            </div>
            <button
              onClick={generatePredictions}
              disabled={refreshing}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              aria-label="Refresh predictions"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Month/Year
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            <Currency className="w-3.5 h-3.5" />
            Projected Sales
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Growth Rate (vs. Base)
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {predictions.map((pred, index) => (
            <div
              key={`${pred.month}-${index}`}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group"
            >
              {/* Month/Year */}
              <div className="flex items-center justify-between sm:justify-start">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:hidden">Month/Year</span>
                <div className="flex items-center gap-2">
                  {/* Styling the year part differently for emphasis */}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {pred.month.split(" ")[0]}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 p-1 rounded-md bg-blue-50 dark:bg-blue-900/20">
                    {pred.month.split(" ")[1]}
                  </span>
                </div>
              </div>

              {/* Projected Sales */}
              <div className="flex items-center justify-between sm:justify-start">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:hidden">Projected Sales</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatNaira(pred.projectedSales)}
                  </span>
                </div>
              </div>

              {/* Growth Rate */}
              <div className="flex items-center justify-between sm:justify-start">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:hidden">Growth Rate</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
                  <ArrowUpRight className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {pred.growthRate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Predictions generated dynamically • Next update in 10s
          </p>
        </div>
      </CardContent>
    </Card>
  );
}