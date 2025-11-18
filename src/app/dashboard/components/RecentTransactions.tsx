"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, ReactNode } from "react";

type BadgeProps = { children: ReactNode; className?: string };
function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

export function RecentTransactions() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const transactions: Transaction[] = [
    { id: "TXN-001", customer: "John Doe", amount: 48000, status: "Completed", date: "Oct 9, 2025" },
    { id: "TXN-002", customer: "Sarah Johnson", amount: 32000, status: "Pending", date: "Oct 10, 2025" },
    { id: "TXN-003", customer: "Michael Lee", amount: 76000, status: "Completed", date: "Oct 11, 2025" },
    { id: "TXN-004", customer: "Jane Smith", amount: 15000, status: "Failed", date: "Oct 11, 2025" },
    { id: "TXN-005", customer: "David Brown", amount: 50000, status: "Completed", date: "Oct 12, 2025" },
  ];

  if (!mounted)
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-400">
          Loading transactions...
        </CardContent>
      </Card>
    );

  return (
    <Card className="justify-center items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {txn.customer}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  ₦{txn.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      txn.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : txn.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {txn.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {txn.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
