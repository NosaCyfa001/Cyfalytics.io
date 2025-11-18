import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// In production, store in database
const NOTIFICATION_SETTINGS = new Map<string, {
  emailAlerts: boolean;
  pushNotifications: boolean;
  salesAlerts: boolean;
  revenueThreshold: number;
  dailyReports: boolean;
  weeklyReports: boolean;
}>();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = NOTIFICATION_SETTINGS.get(userId) || {
    emailAlerts: true,
    pushNotifications: false,
    salesAlerts: true,
    revenueThreshold: 1000000,
    dailyReports: true,
    weeklyReports: true,
  };

  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await req.json();
  NOTIFICATION_SETTINGS.set(userId, settings);

  return NextResponse.json({ success: true, settings });
}