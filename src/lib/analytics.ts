export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
}

export interface MonthlyAnalytics {
  month: string;
  revenue: number;
  transactions: number;
}

export function generateTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];
  const categories = ["Sales", "Refund", "Fee", "Transfer"];

  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `tx-${Date.now()}-${i}`,
      amount: Math.floor(Math.random() * 10000) + 100,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      description: `Transaction ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }

  return transactions;
}

export function buildMonthlyAnalytics(transactions: Transaction[]): MonthlyAnalytics[] {
  const monthlyMap = new Map<string, MonthlyAnalytics>();

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const monthKey = date.toISOString().slice(0, 7);

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        revenue: 0,
        transactions: 0,
      });
    }

    const entry = monthlyMap.get(monthKey)!;
    entry.revenue += tx.amount;
    entry.transactions += 1;
  });

  return Array.from(monthlyMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}

export function addForecast(analytics: MonthlyAnalytics[]): any[] {
  if (analytics.length === 0) return [];

  const avgRevenue =
    analytics.reduce((sum, a) => sum + a.revenue, 0) / analytics.length;
  const lastMonth = analytics[analytics.length - 1];

  const forecast = {
    month: new Date(lastMonth.month + "-01").toISOString().slice(0, 7),
    revenue: Math.round(avgRevenue),
    transactions: Math.round(
      analytics.reduce((sum, a) => sum + a.transactions, 0) /
        analytics.length
    ),
    isForecast: true,
  };

  return [...analytics, forecast];
}
