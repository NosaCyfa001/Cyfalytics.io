"use client";

import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "sale" | "alert" | "order";
}

interface NotificationPreferences {
  enabled: boolean;
  sales: boolean;
  alerts: boolean;
  orders: boolean;
  sound: boolean;
  email: boolean;
}

interface SalesData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  regions: Array<{
    region: string;
    revenue: number;
    orders: number;
    topProduct: string;
  }>;
  timestamp: string;
}

const STORAGE_KEYS = {
  NOTIFICATIONS: "notifications",
  PREFERENCES: "notification_preferences",
};

const storage = {
  getNotifications: (): Notification[] => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveNotifications: (notifs: Notification[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error("Failed to save notifications:", e);
    }
  },
  getPreferences: (): NotificationPreferences => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        enabled: true,
        sales: true,
        alerts: true,
        orders: true,
        sound: true,
        email: false,
      };
    } catch {
      return {
        enabled: true,
        sales: true,
        alerts: true,
        orders: true,
        sound: true,
        email: false,
      };
    }
  },
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(url: string) {
    this.url = url;
  }

  connect(
    onMessage: (data: SalesData) => void,
    onError: (error: string) => void
  ): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent<string>) => {
        try {
          const data: SalesData = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      this.ws.onerror = () => {
        this.reconnect(onMessage, onError);
      };

      this.ws.onclose = () => {
        this.reconnect(onMessage, onError);
      };
    } catch {
      onError("Failed to connect WebSocket");
      this.reconnect(onMessage, onError);
    }
  }

  private reconnect(
    onMessage: (data: SalesData) => void,
    onError: (error: string) => void
  ): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(onMessage, onError);
      }, this.reconnectDelay);
    } else {
      onError("WebSocket connection failed");
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const generateNotificationsFromDelta = (
  oldData: SalesData | null,
  newData: SalesData,
  preferences: NotificationPreferences
): Notification[] => {
  const notifications: Notification[] = [];

  if (!oldData) return [];

  const revenueDelta = newData.summary.totalRevenue - oldData.summary.totalRevenue;
  const ordersDelta = newData.summary.totalOrders - oldData.summary.totalOrders;

  if (preferences.sales && revenueDelta > 1000000) {
    notifications.push({
      id: `sale-delta-${Date.now()}`,
      title: "New Sales! 🚀",
      message: `₦${(revenueDelta / 1_000_000).toFixed(1)}M in new revenue`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type: "sale",
    });
  }

  if (preferences.orders && ordersDelta > 0) {
    notifications.push({
      id: `orders-delta-${Date.now()}`,
      title: `${ordersDelta} New Order${ordersDelta > 1 ? "s" : ""} 📦`,
      message: `${ordersDelta} new order${ordersDelta > 1 ? "s" : ""} received`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type: "order",
    });
  }

  newData.regions.forEach((newRegion) => {
    const oldRegion = oldData.regions.find((r) => r.region === newRegion.region);
    if (oldRegion) {
      const regionRevenueDelta = newRegion.revenue - oldRegion.revenue;
      if (preferences.alerts && regionRevenueDelta > 500000) {
        notifications.push({
          id: `region-delta-${newRegion.region}-${Date.now()}`,
          title: `${newRegion.region} Activity 📍`,
          message: `+₦${(regionRevenueDelta / 1_000_000).toFixed(1)}M in ${newRegion.region}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
          type: "alert",
        });
      }
    }
  });

  return notifications;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences] = useState<NotificationPreferences>(
    storage.getPreferences()
  );
  const wsRef = useRef<WebSocketManager | null>(null);
  const lastSalesDataRef = useRef<SalesData | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSalesUpdate = useCallback((salesData: SalesData) => {
    const newNotifications = generateNotificationsFromDelta(
      lastSalesDataRef.current,
      salesData,
      preferences
    );

    if (newNotifications.length > 0) {
      setNotifications((prev) => {
        const updated = [
          ...newNotifications.filter(
            (n) => !prev.some((existing) => existing.id === n.id)
          ),
          ...prev,
        ];
        storage.saveNotifications(updated);
        return updated;
      });

      if (preferences.sound) playNotificationSound();
    }

    lastSalesDataRef.current = salesData;
  }, [preferences]);

  const initializePolling = useCallback(() => {
    const fetchSalesData = async (): Promise<void> => {
      try {
        const response = await fetch("/api/sales");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: SalesData = await response.json();
        handleSalesUpdate(data);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      }
    };

    fetchSalesData();
    pollIntervalRef.current = setInterval(fetchSalesData, 30000);
  }, [handleSalesUpdate]);

  const initializeConnections = useCallback(() => {
    const wsUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/sales-ws`;
    wsRef.current = new WebSocketManager(wsUrl);
    wsRef.current.connect(
      (data) => handleSalesUpdate(data),
      () => {
        initializePolling();
      }
    );
  }, [handleSalesUpdate, initializePolling]);

  // Initialize from localStorage and WebSocket
  useEffect(() => {
    const saved = storage.getNotifications();
    setNotifications(saved);

    initializeConnections();

    return () => {
      if (wsRef.current) wsRef.current.disconnect();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [initializeConnections]);

  const playNotificationSound = (): void => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error("Failed to play notification sound:", e);
    }
  };

  const markAsRead = (id: string): void => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      storage.saveNotifications(updated);
      return updated;
    });
  };

  const markAllAsRead = (): void => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      storage.saveNotifications(updated);
      return updated;
    });
  };

  const deleteNotification = (id: string): void => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      storage.saveNotifications(updated);
      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "sale":
        return {
          icon: "🎉",
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
          border: "border-l-4 border-l-green-500",
          dot: "bg-green-500",
        };
      case "alert":
        return {
          icon: "⚠️",
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
          border: "border-l-4 border-l-amber-500",
          dot: "bg-amber-500",
        };
      case "order":
        return {
          icon: "📦",
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
          border: "border-l-4 border-l-blue-500",
          dot: "bg-blue-500",
        };
      default:
        return {
          icon: "🔔",
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-l-4 border-l-gray-500",
          dot: "bg-gray-500",
        };
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full h-10 w-10 transition-all"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1rem)] sm:w-96 p-0 rounded-xl shadow-2xl border-0 overflow-hidden"
        sideOffset={12}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r p-4 from-blue-500 to-cyan-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-white" />
              <h3 className="font-bold text-white text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-white/30 text-white text-xs">{unreadCount}</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              All caught up!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No new notifications
            </p>
          </div>
        ) : (
          <div className="max-h-[70vh] sm:max-h-[500px] overflow-y-auto bg-white dark:bg-gray-900">
            {/* Show most recent 10 notifications */}
            {notifications.slice(0, 10).map((notification, index) => {
              const style = getNotificationStyle(notification.type);
              const recentNotifications = notifications.slice(0, 10);
              return (
                <div
                  key={notification.id}
                  className={`relative group cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    index !== recentNotifications.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={`p-4 ${style.bg} ${style.border} ${
                      !notification.read ? "bg-opacity-100" : "bg-opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-xl">
                        {style.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className={`w-2 h-2 rounded-full ${style.dot} mt-1.5 animate-pulse`} />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <span>🕐</span>
                          {notification.time}
                        </p>
                      </div>

                      {/* Mark as read button (shows on hover) */}
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white dark:hover:bg-gray-700 rounded-full flex-shrink-0"
                        >
                          <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full flex-shrink-0"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900/50 space-y-2">
          {notifications.length > 10 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
              Showing {Math.min(10, notifications.length)} of {notifications.length} notifications
            </p>
          )}
          <Link
            href="/dashboard/notifications"
            className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            View All Notifications →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}