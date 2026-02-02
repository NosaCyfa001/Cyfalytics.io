import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Cyfalytics.io | Analytics Dashboard",
  description: "AI-powered business analytics dashboard powered by Cyfa Tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}