"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Bell, Key, Palette, Shield, Plus, Trash2, Copy, CheckCircle2, Mail, Smartphone } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  salesAlerts: boolean;
  revenueThreshold: number;
  dailyReports: boolean;
  weeklyReports: boolean;
}

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: false,
    salesAlerts: true,
    revenueThreshold: 1000000,
    dailyReports: true,
    weeklyReports: true,
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchApiKeys();
    fetchNotifications();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/api-keys");
      const data = await res.json();
      setApiKeys(data.keys || []);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.settings);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      
      setApiKeys([...apiKeys, data.key]);
      setNewKeyName("");
      setShowNewKeyModal(false);
    } catch (err) {
      console.error("Failed to create API key:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await fetch("/api/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (err) {
      console.error("Failed to delete API key:", err);
    }
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const updateNotifications = async (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...notifications, ...updates };
    setNotifications(newSettings);
    
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (err) {
      console.error("Failed to update notifications:", err);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-800 border-t-blue-600"></div>
      </div>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 w-fit">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Secured
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Quick Settings */}
        <div className="space-y-6 lg:order-2">
          {/* Theme Selector */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Appearance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => setTheme("light")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-blue-50 border border-gray-200 flex items-center justify-center text-lg">
                    ☀️
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Light</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bright theme</p>
                  </div>
                </div>
                {theme === "light" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-gray-700 flex items-center justify-center text-lg">
                    🌙
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Easy on eyes</p>
                  </div>
                </div>
                {theme === "dark" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  theme === "system"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 via-blue-50 to-slate-900 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-lg">
                    💻
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">System</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Auto switch</p>
                  </div>
                </div>
                {theme === "system" && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Notifications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Alerts</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive email notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => updateNotifications({ emailAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mobile & browser alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => updateNotifications({ pushNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sales Alerts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get notified of new sales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.salesAlerts}
                    onChange={(e) => updateNotifications({ salesAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    API Keys
                  </CardTitle>
                </div>
                <button
                  onClick={() => setShowNewKeyModal(true)}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    No API keys yet
                  </p>
                </div>
              ) : (
                apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{key.name}</p>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 font-mono truncate">
                        {key.key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {copiedKey === key.id ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Created {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}

              {/* New Key Modal */}
              {showNewKeyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Create New API Key
                    </h3>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter key name..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewKeyModal(false)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createApiKey}
                        disabled={loading || !newKeyName.trim()}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      >
                        {loading ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Clerk Profile */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <UserProfile
                routing="hash"
                appearance={{
                  variables: {
                    colorPrimary: "#3b82f6",
                    colorBackground: currentTheme === "dark" ? "#1f2937" : "#ffffff",
                    colorText: currentTheme === "dark" ? "#f9fafb" : "#111827",
                    colorInputBackground: currentTheme === "dark" ? "#111827" : "#f9fafb",
                  },
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none bg-transparent",
                    navbar: "bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700",
                    headerTitle: "text-gray-900 dark:text-gray-100 text-xl font-semibold",
                    headerSubtitle: "text-gray-500 dark:text-gray-400",
                    profileSectionTitleText: "text-gray-900 dark:text-gray-100 font-semibold",
                    profileSection: "border-gray-200 dark:border-gray-700",
                    formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium",
                    formFieldInput: "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500",
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white",
                    formButtonReset: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                    avatarBox: "border-2 border-blue-500",
                    pageScrollBox: "bg-white dark:bg-gray-800",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}