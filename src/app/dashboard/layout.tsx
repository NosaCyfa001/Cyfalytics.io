import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavbarSidebarWrapper from "../components/NavbarSidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Wait for auth() to resolve
  const { userId } = await auth();

  // 🔒 Redirect if not logged in
  if (!userId) {
    redirect("/sign-in");
  }

  // ✅ Authenticated users see the dashboard UI
  return <NavbarSidebarWrapper>{children}</NavbarSidebarWrapper>;
}
