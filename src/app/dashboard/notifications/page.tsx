"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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
  Volume2,
  VolumeX,
} from "lucide-react";

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
  READ_STATE: "notification_read_state",
};

// Utility: Save/load from localStorage
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
  saveNotifications: (notifs: Notification[]): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(notifs),
      );
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
  savePreferences: (prefs: NotificationPreferences): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(prefs),
      );
    } catch (e) {
      console.error("Failed to save preferences:", e);
    }
  },
  getLastSync: (): string => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || "";
  },
  setLastSync: (timestamp: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
  },
};

// WebSocket Manager
class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isManuallyDisconnected = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(
    onMessage: (data: SalesData) => void,
    onError: (error: string) => void,
  ): void {
    if (this.isManuallyDisconnected) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = (): void => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data: SalesData = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      this.ws.onerror = (): void => {
        if (!this.isManuallyDisconnected) {
          this.reconnect(onMessage, onError);
        }
      };

      this.ws.onclose = (): void => {
        console.log("WebSocket closed");
        if (!this.isManuallyDisconnected) {
          this.reconnect(onMessage, onError);
        }
      };
    } catch (error) {
      onError("Failed to connect WebSocket");
      if (!this.isManuallyDisconnected) {
        this.reconnect(onMessage, onError);
      }
    }
  }

  private reconnect(
    onMessage: (data: SalesData) => void,
    onError: (error: string) => void,
  ): void {
    if (this.isManuallyDisconnected) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect(onMessage, onError);
      }, this.reconnectDelay);
    } else {
      onError("WebSocket connection failed - falling back to polling");
    }
  }

  disconnect(): void {
    this.isManuallyDisconnected = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: SalesData): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// Generate notifications from sales delta
const generateNotificationsFromDelta = (
  oldData: SalesData | null,
  newData: SalesData,
  preferences: NotificationPreferences,
): Notification[] => {
  const notifications: Notification[] = [];

  if (!oldData || !preferences.enabled) return [];

  const revenueDelta =
    newData.summary.totalRevenue - oldData.summary.totalRevenue;
  const ordersDelta = newData.summary.totalOrders - oldData.summary.totalOrders;

  // High revenue delta
  if (preferences.sales && revenueDelta > 1000000) {
    notifications.push({
      id: `sale-delta-${Date.now()}-${Math.random()}`,
      title: "New Sales! 🚀",
      message: `₦${(revenueDelta / 1_000_000).toFixed(1)}M in new revenue`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(),
      read: false,
      type: "sale",
    });
  }

  // New orders
  if (preferences.orders && ordersDelta > 0) {
    notifications.push({
      id: `orders-delta-${Date.now()}-${Math.random()}`,
      title: `${ordersDelta} New Order${ordersDelta > 1 ? "s" : ""} 📦`,
      message: `${ordersDelta} new order${ordersDelta > 1 ? "s" : ""} received`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(),
      read: false,
      type: "order",
    });
  }

  // Regional changes
  newData.regions.forEach((newRegion) => {
    const oldRegion = oldData.regions.find(
      (r) => r.region === newRegion.region,
    );
    if (oldRegion) {
      const regionRevenueDelta = newRegion.revenue - oldRegion.revenue;
      if (preferences.alerts && regionRevenueDelta > 500000) {
        notifications.push({
          id: `region-delta-${newRegion.region}-${Date.now()}-${Math.random()}`,
          title: `${newRegion.region} Activity 📍`,
          message: `+₦${(regionRevenueDelta / 1_000_000).toFixed(1)}M in ${newRegion.region}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(),
          read: false,
          type: "alert",
        });
      }
    }
  });

  return notifications;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "sale" | "alert" | "order">("all");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [showSettings, setShowSettings] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);

  const wsRef = useRef<WebSocketManager | null>(null);
  const lastSalesDataRef = useRef<SalesData | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const preferencesRef = useRef<NotificationPreferences>(preferences);
  const toastTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const processingUpdateRef = useRef(false);
  const activeOscillatorsRef = useRef<Set<OscillatorNode>>(new Set());

  // Update preferences ref whenever preferences change
  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  // Cleanup audio context and stop all sounds on unmount or when sound is disabled
  useEffect(() => {
    return () => {
      // Stop all active oscillators
      activeOscillatorsRef.current.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      activeOscillatorsRef.current.clear();

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Stop all sounds when sound preference is turned off
  useEffect(() => {
    if (!preferences.sound) {
      // Stop all currently playing sounds
      activeOscillatorsRef.current.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      activeOscillatorsRef.current.clear();

      // Close and reset audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  }, [preferences.sound]);

  const playNotificationSound = useCallback((): void => {
    // Don't play if sound is disabled
    if (!preferencesRef.current.sound) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }

      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );

      // Track active oscillator
      activeOscillatorsRef.current.add(oscillator);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      // Remove from active set after it stops
      oscillator.onended = () => {
        activeOscillatorsRef.current.delete(oscillator);
      };
    } catch (e) {
      console.error("Failed to play notification sound:", e);
    }
  }, []);

  const showToast = useCallback(
    (title: string, message: string, type: Toast["type"]): void => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, title, message, type };
      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastTimersRef.current.delete(id);
      }, 5000);

      toastTimersRef.current.set(id, timer);
    },
    [],
  );

  const handleSalesUpdate = useCallback(
    (salesData: SalesData): void => {
      // Prevent concurrent processing
      if (processingUpdateRef.current) return;
      processingUpdateRef.current = true;

      try {
        const newNotifications = generateNotificationsFromDelta(
          lastSalesDataRef.current,
          salesData,
          preferencesRef.current,
        );

        if (newNotifications.length > 0) {
          setNotifications((prev) => {
            const filtered = newNotifications.filter(
              (n) => !prev.some((existing) => existing.id === n.id),
            );
            return [...filtered, ...prev];
          });

          newNotifications.forEach((n) => {
            showToast(n.title, n.message, n.type);
            // Only play sound if enabled
            if (preferencesRef.current.sound && preferencesRef.current.enabled) {
              playNotificationSound();
            }
          });
        }

        lastSalesDataRef.current = salesData;
        storage.setLastSync(salesData.timestamp);
      } finally {
        processingUpdateRef.current = false;
      }
    },
    [showToast, playNotificationSound],
  );

  const initializePolling = useCallback((): void => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

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

  // Load from storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = storage.getNotifications();
    const savedPrefs = storage.getPreferences();
    setNotifications(saved);
    setPreferences(savedPrefs);
    setLoading(false);
  }, []);

  // Initialize connections once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const wsUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/sales-ws`;
    wsRef.current = new WebSocketManager(wsUrl);

    wsRef.current.connect(
      (data) => {
        setWsConnected(true);
        setWsError(null);
        handleSalesUpdate(data);
      },
      (error) => {
        setWsError(error);
        setWsConnected(false);
        initializePolling();
      },
    );

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      // Clear all toast timers
      toastTimersRef.current.forEach((timer) => clearTimeout(timer));
      toastTimersRef.current.clear();
    };
  }, [handleSalesUpdate, initializePolling]);

  // Save notifications whenever they change (with debounce)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        storage.saveNotifications(notifications);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Save preferences whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      storage.savePreferences(preferences);
    }
  }, [preferences]);

  const markAsRead = useCallback((id: string): void => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback((): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const deleteAll = useCallback((): void => {
    if (confirm("Delete all notifications?")) {
      setNotifications([]);
    }
  }, []);

  const updatePreferences = useCallback(
    (key: keyof NotificationPreferences): void => {
      setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimersRef.current.delete(id);
    }
  }, []);

  // Test sound function
  const testSound = useCallback((): void => {
    playNotificationSound();
  }, [playNotificationSound]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "sale":
        return {
          icon: "🎉",
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
          border: "border-l-4 border-l-green-500",
          badge:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          toastBg: "bg-gradient-to-r from-green-500 to-emerald-500",
        };
      case "alert":
        return {
          icon: "⚠️",
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
          border: "border-l-4 border-l-amber-500",
          badge:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          toastBg: "bg-gradient-to-r from-amber-500 to-yellow-500",
        };
      case "order":
        return {
          icon: "📦",
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
          border: "border-l-4 border-l-blue-500",
          badge:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          toastBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        };
      default:
        return {
          icon: "🔔",
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-l-4 border-l-gray-500",
          badge:
            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          toastBg: "bg-gray-500",
        };
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "sale" || filter === "alert" || filter === "order")
      return n.type === filter;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {toasts.map((toast) => {
          const style = getNotificationStyle(toast.type);
          return (
            <div
              key={toast.id}
              className={`${style.toastBg} text-white rounded-lg shadow-lg p-4 animate-in slide-in-from-top-2 duration-300`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
                  <p className="text-xs opacity-90">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 opacity-70 hover:opacity-100"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? (
                  <>
                    You have{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {unreadCount} unread
                    </span>
                  </>
                ) : (
                  "All caught up!"
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="gap-1 text-xs sm:text-sm p-2"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-1 text-xs sm:text-sm p-2"
                >
                  <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Mark all</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteAll}
                  className="gap-1 text-xs sm:text-sm p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span
              className={`inline-block w-2 h-2 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
              aria-label={wsConnected ? "Connected" : "Disconnected"}
            ></span>
            {wsConnected
              ? "Live (WebSocket)"
              : wsError
                ? `Polling (${wsError})`
                : "Connecting..."}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.enabled}
                    onChange={() => updatePreferences("enabled")}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Enable notifications
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.sales}
                    onChange={() => updatePreferences("sales")}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={!preferences.enabled}
                  />
                  <span
                    className={`text-sm ${!preferences.enabled ? "opacity-50" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    🎉 Sales alerts
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.alerts}
                    onChange={() => updatePreferences("alerts")}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={!preferences.enabled}
                  />
                  <span
                    className={`text-sm ${!preferences.enabled ? "opacity-50" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    ⚠️ Stock alerts
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.orders}
                    onChange={() => updatePreferences("orders")}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={!preferences.enabled}
                  />
                  <span
                    className={`text-sm ${!preferences.enabled ? "opacity-50" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    📦 Order notifications
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={preferences.sound}
                    onChange={() => updatePreferences("sound")}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={!preferences.enabled}
                  />
                  <span
                    className={`text-sm flex items-center gap-2 ${!preferences.enabled ? "opacity-50" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {preferences.sound ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    Sound alerts
                  </span>
                  {preferences.sound && preferences.enabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={testSound}
                      className="ml-auto text-xs px-2 py-1 h-auto"
                    >
                      Test
                    </Button>
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={() => updatePreferences("email")}
                    className="w-4 h-4 rounded border-gray-300"
                    disabled
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 opacity-50">
                    <Mail className="h-4 w-4" />
                    Email notifications (coming soon)
                  </span>
                </label>
              </div>
            </Card>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Unread", value: "unread" },
                { label: "Sales", value: "sale" },
                { label: "Alerts", value: "alert" },
                { label: "Orders", value: "order" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as typeof filter)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    filter === f.value
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {f.label}
                  {f.value === "unread" && unreadCount > 0 && (
                    <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="p-4 sm:p-6 animate-pulse bg-gray-100 dark:bg-gray-800"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No notifications
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "You're all caught up!"
                : `No ${filter} notifications`}
            </p>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredNotifications.map((notification) => {
              const style = getNotificationStyle(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    !notification.read ? "ring-2 ring-blue-500/50" : ""
                  }`}
                >
                  <div
                    className={`p-3 sm:p-6 ${style.bg} ${style.border} group`}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-lg sm:text-2xl">
                        {style.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-lg text-gray-900 dark:text-gray-100">
                              {notification.title}
                            </h3>
                            <Badge className={`text-xs ${style.badge}`}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            🕐 {notification.time}
                          </p>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                          {notification.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="gap-1 text-xs p-1.5 sm:p-2"
                            >
                              <Check className="h-3 w-3" />
                              <span className="hidden sm:inline">
                                Mark read
                              </span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="gap-1 text-xs p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && notifications.length > 0 && (
          <div className="mt-8 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
                <div>
                  Total:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {notifications.length}
                  </span>
                </div>
                <div>
                  Unread:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {unreadCount}
                  </span>
                </div>
                <div>
                  Read:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {notifications.length - unreadCount}
                  </span>
                </div>
              </div>
              <p className="text-xs">
                Last synced:{" "}
                {storage.getLastSync()
                  ? new Date(storage.getLastSync()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}