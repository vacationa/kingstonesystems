"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { io, Socket } from "socket.io-client";
import { demoCampaigns, demoMetrics, demoActivities } from "@/app/constants/demo-data";
import { useUser } from "@/context/user-context";
import { useDemoMode } from "@/app/context/demo-mode-context";

interface RealtimeContextType {
  // Campaign updates
  campaigns: any[];
  updateCampaigns: (campaigns: any[]) => void;

  // Connection updates
  connections: any[];
  updateConnections: (connections: any[]) => void;

  // Metrics updates
  metrics: any;
  updateMetrics: (metrics: any) => void;

  // Activity updates
  activities: any[];
  updateActivities: (activities: any[]) => void;

  // Connection status
  isConnected: boolean;

  // Manual refresh functions
  refreshCampaigns: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshCampaignMetrics: (campaignId: string) => Promise<any>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalImported: 0,
    totalSent: 0,
    accepted: 0,
    pending: 0,
    acceptanceRate: 0,
    responseRate: 0,
    totalMessages: 0,
    messageConversionRate: 0,
    dailyAverage: 0,
    weeklyGrowth: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const user = useUser();
  const { isDemoMode } = useDemoMode();
  const supabase = createClient();

  // Initialize real-time subscriptions
  useEffect(() => {
    const userId = user?.user?.id;

    // Handle no user or logged out state
    if (!userId) {
      setCampaigns([]);
      setConnections([]);
      setMetrics(null);
      setActivities([]);
      setIsConnected(false);
      return;
    }

    // Subscribe to LinkedIn connection status changes
    const profileSubscription = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          // If linkedin_connected status changed
          if ("linkedin_connected" in payload.new) {
            const isLinkedInConnected = payload.new.linkedin_connected;
            // Update local storage to match database state
            if (isLinkedInConnected) {
              localStorage.setItem("linkedInCredentials", "true");
            } else {
              localStorage.removeItem("linkedInCredentials");
            }
            // Dispatch event to notify components
            window.dispatchEvent(new Event("linkedInCredentialsChanged"));
          }
        },
      )
      .subscribe();

    // Initialize Socket.IO for LinkedIn automation updates
    const LOGIN_API_BASE =
      process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "https://socket.icptiger.com";
    const sock = io(LOGIN_API_BASE, {
      query: { user_id: userId },
    });

    sock.on("connect", () => {
      setIsConnected(true);
    });

    sock.on("disconnect", () => {
      setIsConnected(false);
    });

    sock.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setIsConnected(false);
    });

    // Listen for campaign updates from automation
    sock.on("campaignUpdate", (data: any) => {
      refreshCampaigns();
      refreshMetrics();
    });

    // Listen for connection updates from automation
    sock.on("connectionUpdate", (data: any) => {
      refreshCampaigns();
      refreshMetrics();
      refreshActivities();
    });

    // Listen for activity updates from automation
    sock.on("activityUpdate", (data: any) => {
      refreshActivities();
    });

    setSocket(sock);

    // Set up Supabase Realtime subscriptions
    const setupRealtimeSubscriptions = async () => {
      // Subscribe to campaign changes
      const campaignsSubscription = supabase
        .channel("campaigns")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_campaigns",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            refreshCampaigns();
            refreshMetrics();
          },
        )
        .subscribe();

      // Subscribe to connection changes
      const connectionsSubscription = supabase
        .channel("connections")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_connections",
          },
          (payload) => {
            refreshCampaigns();
            refreshMetrics();
          },
        )
        .subscribe();

      // Subscribe to log changes
      const logsSubscription = supabase
        .channel("logs")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_logs",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            refreshActivities();
          },
        )
        .subscribe();

      return () => {
        campaignsSubscription.unsubscribe();
        connectionsSubscription.unsubscribe();
        logsSubscription.unsubscribe();
      };
    };

    setupRealtimeSubscriptions();

    return () => {
      profileSubscription.unsubscribe();
      if (sock) {
        sock.disconnect();
      }
    };
  }, [user?.user?.id]);

  // Helper functions for demo campaign persistence
  const getDemoCampaigns = useCallback(() => {
    try {
      const stored = localStorage.getItem('demo_campaigns');
      if (stored) {
        const parsedCampaigns = JSON.parse(stored);
        // Merge with base demo campaigns, ensuring base campaigns are always present
        const baseCampaignIds = new Set(demoCampaigns.map(c => c.id));
        const userCampaigns = parsedCampaigns.filter((c: any) => !baseCampaignIds.has(c.id));
        return [...demoCampaigns, ...userCampaigns];
      }
    } catch (error) {
      console.error("Failed to parse stored demo campaigns:", error);
    }
    return demoCampaigns;
  }, []);

  const saveDemoCampaigns = useCallback((campaigns: any[]) => {
    try {
      // Only save user-created campaigns (not the base demo campaigns)
      const baseCampaignIds = new Set(demoCampaigns.map(c => c.id));
      const userCampaigns = campaigns.filter(c => !baseCampaignIds.has(c.id));
      localStorage.setItem('demo_campaigns', JSON.stringify(userCampaigns));
    } catch (error) {
      console.error("Failed to save demo campaigns:", error);
    }
  }, []);

  // Manual refresh functions
  const refreshCampaigns = useCallback(async () => {
    if (isDemoMode) {
      const demoCampaignsWithUser = getDemoCampaigns();
      setCampaigns(demoCampaignsWithUser);
      return;
    }
    try {
      // API call removed to avoid 404 errors; using demo data or leaving state unchanged.
      if (isDemoMode) {
        const demoCampaignsWithUser = getDemoCampaigns();
        setCampaigns(demoCampaignsWithUser);
      } else {
        // No backend API available; keep existing campaigns unchanged.
        console.warn('refreshCampaigns: API endpoint unavailable, skipping fetch.');
      }
    } catch (error) {
      console.error("Failed to refresh campaigns:", error);
    }
  }, [isDemoMode, getDemoCampaigns]);

  const refreshMetrics = useCallback(async () => {
    if (isDemoMode) {
      setMetrics(demoMetrics);
      return;
    }
    try {
      // API call removed to avoid 404 errors; using demo data or leaving state unchanged.
      if (isDemoMode) {
        setMetrics(demoMetrics);
      } else {
        // No backend API available; keep existing metrics unchanged.
        console.warn('refreshMetrics: API endpoint unavailable, skipping fetch.');
      }
    } catch (error) {
      console.error("Failed to refresh metrics:", error);
    }
  }, [isDemoMode]);

  const refreshActivities = useCallback(async () => {
    if (isDemoMode) {
      setActivities(demoActivities);
      return;
    }
    try {
      // API call removed to avoid 404 errors; using demo data or leaving state unchanged.
      if (isDemoMode) {
        setActivities(demoActivities);
      } else {
        // No backend API available; keep existing activities unchanged.
        console.warn('refreshActivities: API endpoint unavailable, skipping fetch.');
      }
    } catch (error) {
      console.error("Failed to refresh activities:", error);
    }
  }, [isDemoMode]);

  const refreshCampaignMetrics = useCallback(
    async (campaignId: string) => {
      if (isDemoMode) {
        return demoMetrics;
      }
      try {
        // API call removed to avoid 404 errors; using demo data or returning null.
        if (isDemoMode) {
          return demoMetrics;
        } else {
          console.warn('refreshCampaignMetrics: API endpoint unavailable, skipping fetch.');
          return null;
        }
      } catch (error) {
        console.error("Failed to refresh campaign metrics:", error);
        return null;
      }
    },
    [isDemoMode],
  );

  // Simple demo mode effect
  useEffect(() => {
    if (isDemoMode) {
      const demoCampaignsWithUser = getDemoCampaigns();
      setCampaigns(demoCampaignsWithUser);
      setMetrics(demoMetrics);
      setActivities(demoActivities);
      setIsConnected(true);
    } else {
      refreshCampaigns();
      refreshMetrics();
      refreshActivities();
    }
  }, [isDemoMode, getDemoCampaigns]);

  // Enhanced updateCampaigns function that persists in demo mode
  const updateCampaigns = useCallback((newCampaigns: any[]) => {
    setCampaigns(newCampaigns);
    if (isDemoMode) {
      saveDemoCampaigns(newCampaigns);
    }
  }, [isDemoMode, saveDemoCampaigns]);

  const value: RealtimeContextType = {
    campaigns,
    updateCampaigns,
    connections,
    updateConnections: setConnections,
    metrics,
    updateMetrics: setMetrics,
    activities,
    updateActivities: setActivities,
    isConnected,
    refreshCampaigns,
    refreshMetrics,
    refreshActivities,
    refreshCampaignMetrics,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    // Return a safe fallback instead of throwing
    return {
      campaigns: [],
      updateCampaigns: () => { },
      connections: [],
      updateConnections: () => { },
      metrics: null,
      updateMetrics: () => { },
      activities: [],
      updateActivities: () => { },
      isConnected: false,
      refreshCampaigns: async () => { },
      refreshMetrics: async () => { },
      refreshActivities: async () => { },
      refreshCampaignMetrics: async () => null,
    };
  }
  return context;
}
