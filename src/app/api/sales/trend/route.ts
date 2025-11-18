import { NextResponse } from "next/server";

export async function GET() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const data = months.map((month) => ({
    month,
    sales: 100_000_000 + Math.floor(Math.random() * (350_000_000 - 100_000_000)),
  }));

  return NextResponse.json({ salesTrend: data });
}
