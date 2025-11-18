// app/api/sales/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Random utility for varied results each refresh
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Gadget categories commonly sold in Nigeria
  const topProducts = [
    "iPhone 17 Pro Max",
    "Samsung Galaxy S23",
    "Infinix Zero Ultra",
    "Tecno Camon 30",
    "HP Pavilion Laptop",
    "Dell XPS 13",
    "Apple MacBook Air M2",
    "JBL BoomBox 3 Speaker",
    "Sony PS5 Console",
    "Oraimo Power Bank",
  ];

  // Lagos & Abuja region data
  const regions = [
    {
      region: "Lagos",
      revenue: random(200_000_000, 350_000_000), // ₦200–350M
      orders: random(2000, 3200),
      topProduct: topProducts[random(0, topProducts.length - 1)],
    },
    {
      region: "Abuja",
      revenue: random(120_000_000, 230_000_000), // ₦120–230M
      orders: random(1200, 2000),
      topProduct: topProducts[random(0, topProducts.length - 1)],
    },
  ];

  const totalRevenue = regions.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = regions.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const data = {
    summary: {
      totalRevenue,
      totalOrders,
      avgOrderValue,
    },
    regions,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
