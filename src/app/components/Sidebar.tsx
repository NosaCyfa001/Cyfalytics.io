"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart,
  Bot,
  Settings,
  X,
  InfoIcon,
  BellDotIcon,
  BellIcon,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Sales", href: "/dashboard/sales", icon: BarChart },
    { name: "AI Insights", href: "/dashboard/insights", icon: Bot },
    { name: "Readme", href: "/dashboard/readme", icon: InfoIcon },
    { name: "Notifications", href: "/dashboard/notifications", icon: BellIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: isMobile ? -260 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 z-40 overflow-y-auto"
          >
            <div className="p-6 space-y-8">
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              )}

              <nav className="space-y-2">
                {navItems.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
