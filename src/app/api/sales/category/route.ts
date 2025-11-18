import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const categories = [
    "Phones","Laptops","Accessories",
    "Tablets","Power Banks","AirPods","Smart Watches"
  ];

  // Create mock category data for each month up to current
  const monthlyCategoryData = months.slice(0, currentMonth + 1).map((month) => {
    return {
      month,
      categories: categories.map((cat) => ({
        category: cat,
        revenue:
          100_000_000 +
          Math.floor(Math.random() * (400_000_000 - 100_000_000)), // 100–400M
      })),
    };
  });

  return NextResponse.json({ monthlyCategoryData });
}
