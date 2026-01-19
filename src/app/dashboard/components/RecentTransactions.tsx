"use client";

import { Transaction } from "@/lib/analytics";
import { Card } from "@/components/ui/card";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.slice(0, 10).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-gray-500">{tx.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${(tx.amount / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No transactions yet</p>
        )}
      </div>
    </Card>
  );
}
