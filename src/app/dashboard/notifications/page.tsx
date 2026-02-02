"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  Trash2,
  X,
  Settings,
  Mail,
  RefreshCw,
} from "lucide-react";

// --- Interfaces ---

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  type: "sale" | "alert" | "order";
}

interface Toast {
  id: string;
  title: string;
  message: string;
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

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  sales: true,
  alerts: true,
  orders: true,
  sound: true,
  email: false,
};

const STORAGE_KEYS = {
  NOTIFICATIONS: "notifications",
  PREFERENCES: "notification_preferences",
  LAST_SYNC: "last_notification_sync",
};

// --- Storage Utility ---

const storage = {
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data
        ? JSON.parse(data).map((n: Notification) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        : [];
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
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },
  savePreferences: (prefs: NotificationPreferences) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error("Failed to save preferences:", e);
    }
  },
};

// --- Typed WebSocket Manager ---

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(url: string) {
    this.url = url;
  }

  // Replaced 'any' with specific SalesData type
  connect(onMessage: (data: SalesData) => void, onError: (error: string) => void) {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: SalesData = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("WS Parse Error:", e);
        }
      };

      this.ws.onerror = () => {
        onError("WebSocket error");
        this.reconnect(onMessage, onError);
      };

      this.ws.onclose = () => this.reconnect(onMessage, onError);
    } catch {
      onError("Connection failed");
    }
  }

  private reconnect(onMessage: (data: SalesData) => void, onError: (error: string) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(onMessage, onError), this.reconnectDelay);
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }

  // Replaced 'any' with Record
  send(data: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// --- Component ---

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "sale" | "alert" | "order">("all");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [showSettings, setShowSettings] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  const wsRef = useRef<WebSocketManager | null>(null);
  const lastSalesDataRef = useRef<SalesData | null>(null);

  useEffect(() => {
    const saved = storage.getNotifications();
    // If empty, initialize with your requested state: 1 Read, 1 Unread
    if (saved.length === 0) {
      const initial: Notification[] = [
        {
          id: "1",
          title: "New Sale! 🚀",
          message: "iPhone 15 sold for ₦450,000",
          time: "08:56 AM",
          timestamp: new Date(),
          read: false,
          type: "sale",
        },
        {
          id: "2",
          title: "New Order 📦",
          message: "Order #12345 placed by Chinedu Okeke",
          time: "08:30 AM",
          timestamp: new Date(),
          read: true,
          type: "order",
        },
      ];
      setNotifications(initial);
      storage.saveNotifications(initial);
    } else {
      setNotifications(saved);
    }
    setPreferences(storage.getPreferences());
    setLoading(false);
  }, []);

  // Sync state to storage
  useEffect(() => { storage.saveNotifications(notifications); }, [notifications]);
  useEffect(() => { storage.savePreferences(preferences); }, [preferences]);

  const playNotificationSound = () => {
    // Fixed 'any' error for webkitAudioContext
    const WinAudio = window as typeof window & { webkitAudioContext?: typeof AudioContext };
    const AudioCtx = WinAudio.AudioContext || WinAudio.webkitAudioContext;
    if (!AudioCtx) return;

    const audioContext = new AudioCtx();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "sale":
        return {
          icon: "🎉",
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
          border: "border-l-4 border-l-green-500",
          badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          toastBg: "bg-emerald-600",
        };
      case "order":
        return {
          icon: "📦",
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
          border: "border-l-4 border-l-blue-500",
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          toastBg: "bg-blue-600",
        };
      default:
        return {
          icon: "⚠️",
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
          border: "border-l-4 border-l-amber-500",
          badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          toastBg: "bg-amber-600",
        };
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return filter === "all" ? true : n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? (
                  <>You have <span className="font-bold text-blue-600 dark:text-blue-400">{unreadCount} unread</span> messages</>
                ) : "Everything is up to date."}
              </p>
            </div>

            {/* Responsive Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="flex-1 sm:flex-none h-10 gap-2">
                <Settings className="h-4 w-4" /> <span>Settings</span>
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1 sm:flex-none h-10 gap-2">
                  <CheckCheck className="h-4 w-4" /> <span>Mark All</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setNotifications([])} className="flex-1 sm:flex-none h-10 gap-2 text-red-600">
                <Trash2 className="h-4 w-4" /> <span>Clear</span>
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="p-4 mb-6 border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2"> <Bell className="h-4 w-4"/> Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(DEFAULT_PREFERENCES).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences[key as keyof NotificationPreferences]} 
                      onChange={() => setPreferences(p => ({...p, [key]: !p[key as keyof NotificationPreferences]}))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {["all", "unread", "sale", "alert", "order"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    filter === f ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {loading ? (
             <div className="animate-pulse space-y-4">
                {[1,2].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}
             </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No notifications found.</p>
            </Card>
          ) : (
            filteredNotifications.map((n) => {
              const style = getNotificationStyle(n.type);
              return (
                <Card key={n.id} className={`overflow-hidden transition-all ${!n.read ? "ring-2 ring-blue-500/20 shadow-md" : "opacity-80"}`}>
                  <div className={`p-4 sm:p-5 ${style.bg} ${style.border}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-xl">
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{n.title}</h3>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">🕐 {n.time}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{n.message}</p>
                        <div className="flex gap-2">
                          {!n.read && (
                            <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)} className="h-7 text-[10px] bg-white dark:bg-gray-800">
                              <Check className="h-3 w-3 mr-1" /> Mark Read
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => deleteNotification(n.id)} className="h-7 text-[10px] text-red-500 hover:bg-red-50">
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        {!loading && (
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-6 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-gray-900 dark:text-white font-black">{notifications.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Unread:</span>
                  <span className="text-blue-600 font-black">{unreadCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Read:</span>
                  <span className="text-green-600 font-black">{notifications.length - unreadCount}</span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Last updated: 08:58 AM
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}