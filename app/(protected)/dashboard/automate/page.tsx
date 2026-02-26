// file: app/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, Lock, Crown } from "lucide-react";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { CampaignList } from "./components/CampaignList";
import { CampaignModal } from "./components/CampaignModal";
import { RecentActivity } from "./components/RecentActivity";
import { ConnectionRequestsChart } from "./components/ConnectionRequestsChart";
import { DashboardContext } from "./components/DashboardContext";
import { useTimeRange } from "./components/TimeRangeContext";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LinkedInIntegratedLogin } from "@/app/components/linkedin-integrated-login";
import { WarmupStep } from "@/components/pages/dashboard/automate/connect/WarmupStep";
import { createClient } from "@/utils/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading";
import { useUser } from "@/context/user-context";
import { useRealtime } from "@/app/context/realtime-context";
import { useDemoMode } from "@/app/context/demo-mode-context";
import PostHogClient from "@/lib/posthog";
import { CampaignDetails } from "./components/CampaignDetails";
import { demoCampaigns, demoMetrics, demoActivities } from "@/app/constants/demo-data";

import type { Campaign } from "./types";
import type { CampaignData } from "./components/CampaignModal";

interface MetricsDashboardProps {
  metrics: {
    totalImported: number;
    totalSent: number;
    accepted: number;
    pending: number;
    acceptanceRate: number;
    responseRate: number;
    totalMessages: number;
    messageConversionRate: number;
    dailyAverage: number;
    weeklyGrowth: number;
    campaigns: Campaign[];
    weeklyData: number[];
  };
}

interface RecentActivityProps {
  activities: {
    id: number;
    type: string;
    message: string;
    timestamp: string;
    status: string;
  }[];
}

export default function LinkedInAutomationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDemoMode } = useDemoMode();
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const posthog = PostHogClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const { timeRange } = useTimeRange();
  const [showNewCampaignModal, setShowNewCampaignModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [recentActivityHeight, setRecentActivityHeight] = useState<number | null>(null);
  const [showLinkedInLogin, setShowLinkedInLogin] = useState(false);
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);
  const [showWarmupStep, setShowWarmupStep] = useState(false);
  const [warmupLoading, setWarmupLoading] = useState(false);
  const [showCredentialsStep, setShowCredentialsStep] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    sourceType: "searchUrl",
    searchUrl: "",
    connectionMessage: "",
    followUpMessage: "",
    secondFollowUpMessage: "",
    connectionMessageEnabled: false,
    followUpEnabled: true,
    secondFollowUpEnabled: false,
    followUpDays: 2,
    followUpHours: 0,
    secondFollowUpDays: 4,
    secondFollowUpHours: 0,
    dailyLimit: 20,
    weeklyLimit: 100,
    importLimit: 100,
    startDate: "",
    endDate: "",
    hasEndDate: false,
    startTime: "",
    endTime: "17:00",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    sourceType?: string;
    searchUrl?: string;
    connectionMessage?: string;
    followUpMessage?: string;
    secondFollowUpMessage?: string;
    importLimit?: string;
    startDate?: string;
  }>({});
  const [reloadKey, setReloadKey] = useState(0);
  const supabase = createClient();
  const user = useUser();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [specificCampaignMetrics, setSpecificCampaignMetrics] = useState<any>(null);
  const [campaignMetricsLoading, setCampaignMetricsLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{ daysRemaining: number; isLoading: boolean }>({
    daysRemaining: 0,
    isLoading: true,
  });
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);
  const AUTO_PAUSE_STORAGE_KEY = "icptiger_autoPaused_campaigns";

  // Ensure loading state is set on mount and stays true for minimum duration
  useEffect(() => {
    setIsLoading(true);

    // Set a minimum loading time
    const minLoadingTimer = setTimeout(() => {
      // Only set to false if we haven't already set credentials
      if (hasCredentials === null) {
        setIsLoading(false);
      }
    }, 2000); // 2 seconds minimum loading time

    return () => clearTimeout(minLoadingTimer);
  }, []);

  // Use real-time context
  const {
    campaigns,
    updateCampaigns,
    metrics: realtimeMetrics,
    activities,
    isConnected,
    refreshCampaigns,
    refreshMetrics,
    refreshActivities,
    refreshCampaignMetrics,
  } = useRealtime();

  // Initialize dashboard state
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function initializeDashboard() {
      // Don't set isLoading here since it's already set in the mount effect
      // Just ensure we have a minimum loading time
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        if (isDemoMode) {
          // Track demo mode dashboard view
          posthog.capture("dashboard_viewed", {
            mode: "demo",
            timestamp: new Date().toISOString(),
            page: "/dashboard/automate",
          });
          // Use demo data in demo mode
          updateCampaigns(demoCampaigns);
          setTrialStatus({ daysRemaining: 30, isLoading: false });
          user.setImportStatus({ remainingImports: 1000 });
          setHasCredentials(true);
          // Wait for minimum loading time before setting loading to false
          await minLoadingTime;
          if (mounted) {
            setIsLoading(false);
            setTimeout(() => setHasLoaded(true), 100);
          }
          return;
        }

        // Reset state when demo mode is turned off
        if (!isDemoMode) {
          setSelectedCampaign(null);
          setSpecificCampaignMetrics(null);
        }

        // Only fetch real data in non-demo mode
        const res = await fetch("/api/dashboard-init");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        if (!mounted) return;

        updateCampaigns(data.campaigns || []);
        setTrialStatus({ daysRemaining: data.trial?.daysRemaining ?? 0, isLoading: false });
        user.setImportStatus(data.importStatus || { remainingImports: 0 });
        const isConnected = !!data.profile?.linkedin_connected;
        setHasCredentials(isConnected);

        // Track dashboard view with user data
        posthog.capture("dashboard_viewed", {
          mode: "real",
          linkedin_connected: isConnected,
          campaigns_count: data.campaigns?.length || 0,
          trial_days_remaining: data.trial?.daysRemaining ?? 0,
          remaining_imports: data.importStatus?.remainingImports || 0,
          timestamp: new Date().toISOString(),
          page: "/dashboard/automate",
        });
      } catch (err) {
        console.error("Dashboard init error:", err);
        if (mounted) {
          setTrialStatus((prev) => ({ ...prev, isLoading: false }));
          // Set default values on error to prevent white screen
          updateCampaigns([]);
          user.setImportStatus({ remainingImports: 0 });
          // Don't reset hasCredentials on error - keep the previous value
          if (hasCredentials === null) {
            setHasCredentials(false);
          }
        }
      } finally {
        if (mounted) {
          // Wait for minimum loading time before setting loading to false
          await minLoadingTime;
          setIsLoading(false);
          // Trigger entrance animations after a short delay
          setTimeout(() => setHasLoaded(true), 100);
        }
      }
    }

    // Add a timeout fallback to prevent infinite loading (only in non-demo mode)
    if (!isDemoMode) {
      timeoutId = setTimeout(() => {
        if (mounted && isLoading) {
          console.warn("Dashboard init timeout - forcing load completion");
          setIsLoading(false);
          setHasLoaded(true);
          setTrialStatus((prev) => ({ ...prev, isLoading: false }));
          updateCampaigns([]);
          user.setImportStatus({ remainingImports: 0 });
        }
      }, 10000);
    }

    initializeDashboard();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isDemoMode, user?.user?.id]);

  // Fetch subscription/trial to compute accessAllowed and trigger auto-pause/restore
  useEffect(() => {
    let mounted = true;
    async function fetchAccess() {
      try {
        const res = await fetch("/api/check-trial-status");
        const data = await res.json();
        if (!mounted) return;

        const subscribed = !!data?.subscribed;
        const daysRemaining = Number(data?.daysRemaining ?? 0);
        const allowed = subscribed || daysRemaining > 0;
        setAccessAllowed(allowed);

        if (trialStatus.isLoading) {
          setTrialStatus({ daysRemaining, isLoading: false });
        }
      } catch (e) {
        if (mounted) setAccessAllowed(true);
      }
    }
    if (!isDemoMode) fetchAccess();
    return () => {
      mounted = false;
    };
  }, [isDemoMode, trialStatus.isLoading]);

  // Helpers to manage auto-paused state in localStorage
  const readAutoPaused = (): { id: number; status: Campaign["status"] }[] => {
    try {
      const raw = localStorage.getItem(AUTO_PAUSE_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as { id: number; status: Campaign["status"] }[];
      return [];
    } catch {
      return [];
    }
  };
  const writeAutoPaused = (items: { id: number; status: Campaign["status"] }[]) => {
    try {
      localStorage.setItem(AUTO_PAUSE_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };
  const clearAutoPaused = () => {
    try {
      localStorage.removeItem(AUTO_PAUSE_STORAGE_KEY);
    } catch {}
  };

  // Auto-pause active campaigns when access is not allowed; restore when allowed
  useEffect(() => {
    if (isDemoMode) return;
    if (accessAllowed === null) return;
    if (!campaigns || campaigns.length === 0) return;

    const doAutoPause = async () => {
      const already = readAutoPaused();
      const toPause = campaigns.filter((c) => c.status === "active");
      if (toPause.length === 0) return;

      const knownIds = new Set(already.map((i) => i.id));
      const original = [
        ...already,
        ...toPause.filter((c) => !knownIds.has(c.id)).map((c) => ({ id: c.id, status: c.status })),
      ];
      writeAutoPaused(original);

      updateCampaigns(
        campaigns.map((c) => (c.status === "active" ? { ...c, status: "paused" } : c)),
      );

      await Promise.allSettled(
        toPause.map((c) =>
          fetch(`/api/campaigns/${c.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "paused" }),
          }),
        ),
      );
      refreshCampaigns();
    };

    const doRestore = async () => {
      const stored = readAutoPaused();
      if (stored.length === 0) return;

      const map = new Map<number, Campaign["status"]>(
        stored.filter((item) => item.status !== "completed").map((item) => [item.id, item.status]),
      );
      if (map.size === 0) {
        clearAutoPaused();
        return;
      }

      const toRestore = campaigns.filter((c) => map.has(c.id) && c.status === "paused");
      if (toRestore.length === 0) {
        clearAutoPaused();
        return;
      }

      updateCampaigns(
        campaigns.map((c) =>
          map.has(c.id) && c.status === "paused" ? { ...c, status: map.get(c.id)! } : c,
        ),
      );

      await Promise.allSettled(
        toRestore.map((c) =>
          fetch(`/api/campaigns/${c.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: map.get(c.id) }),
          }),
        ),
      );
      clearAutoPaused();
      refreshCampaigns();
    };

    if (accessAllowed === false) {
      doAutoPause();
    } else if (accessAllowed === true) {
      doRestore();
    }
  }, [accessAllowed, campaigns, isDemoMode, updateCampaigns, refreshCampaigns]);

  const handleToggleCampaign = async (id: string, status?: string, startDate?: string) => {
    if (!status || !startDate) {
      toast.error("Unable to update campaign: missing status or start date.");
      console.error("handleToggleCampaign called without status or startDate", {
        id,
        status,
        startDate,
      });
      return;
    }
    const now = new Date();
    const start = new Date(startDate);
    const numericId = Number(id);

    // Покращена логіка для збереження оригінального статусу
    let newStatus: "queued" | "active" | "paused" | "completed";

    if (status === "paused") {
      // Відновлюємо кампанію: завжди повертаємо до "active" якщо кампанія була зупинена
      // Це дозволяє відновлювати кампанії незалежно від часу
      newStatus = "active";
    } else {
      // Зупиняємо кампанію
      newStatus = "paused";
    }

    // Find campaign for tracking
    const campaign = campaigns.find((c) => c.id === numericId);

    // Track campaign toggle action
    posthog.capture("campaign_toggled", {
      campaign_id: id,
      campaign_name: campaign?.name || "Unknown",
      previous_status: status,
      new_status: newStatus,
      is_demo: isDemoMode,
      timestamp: new Date().toISOString(),
      page: "/dashboard/automate",
    });

    // 1) update UI immediately
    updateCampaigns(campaigns.map((c) => (c.id === numericId ? { ...c, status: newStatus } : c)));

    try {
      // 2) hit the API
      const res = await fetch(`/api/campaigns/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();

      toast.success(`Campaign ${newStatus} successfully!`);
      // 3) Re-fetch campaigns to ensure UI is in sync
      if (!isDemoMode) {
        refreshCampaigns();
      }
    } catch {
      // 4) revert on failure
      updateCampaigns(campaigns.map((c) => (c.id === numericId ? { ...c, status } : c)));
      toast.error("Failed to update campaign status.");
    }
  };

  const handleStartCampaign = () => {
    // Track start campaign modal open
    posthog.capture("campaign_modal_opened", {
      action: "create_new",
      is_demo: isDemoMode,
      campaigns_count: campaigns.length,
      timestamp: new Date().toISOString(),
      page: "/dashboard/automate",
    });
    setShowNewCampaignModal(true);
  };

  // Check if warmup modal should be shown
  const shouldShowWarmupModal = async () => {
    if (!user?.user?.id) return false;

    // 1. Check localStorage - has user already made a choice?
    const warmupChoiceKey = `warmup-choice-${user.user.id}`;
    const existingChoice = localStorage.getItem(warmupChoiceKey);
    if (existingChoice) {
      return false; // Already made a choice
    }

    // 2. Check account age using existing created_at field
    const { data: profile } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", user.user.id)
      .single();

    if (!profile?.created_at) return false;

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceSignup = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // 3. Show only if account is less than 14 days old
    return daysSinceSignup <= 14;
  };

  const handleWarmupSkip = async () => {
    try {
      setWarmupLoading(true);
      const res = await fetch("/api/limits/skip-warmup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.user?.id }),
      });
      if (!res.ok) throw new Error("Failed to set skip");

      // Save choice in localStorage
      if (user?.user?.id) {
        const warmupChoiceKey = `warmup-choice-${user.user.id}`;
        localStorage.setItem(warmupChoiceKey, "skipped");
      }

      setShowWarmupStep(false);
      setShowCredentialsStep(true);
    } catch (e) {
      console.error("Skip warmup error:", e);
      toast.error("Failed to skip warmup. Please try again.");
    } finally {
      setWarmupLoading(false);
    }
  };

  const handleWarmupKeep = () => {
    // Save choice in localStorage
    if (user?.user?.id) {
      const warmupChoiceKey = `warmup-choice-${user.user.id}`;
      localStorage.setItem(warmupChoiceKey, "kept");
    }

    setShowWarmupStep(false);
    setShowCredentialsStep(true);
  };

  const handleCampaignCreated = (newCampaign: any) => {
    // Track campaign creation
    posthog.capture("campaign_created", {
      campaign_name: newCampaign.name,
      campaign_type: newCampaign.sourceType,
      is_demo: isDemoMode,
      daily_limit: newCampaign.dailyLimit,
      follow_up_enabled: newCampaign.followUpEnabled,
      connection_message_enabled: newCampaign.connectionMessageEnabled,
      timestamp: new Date().toISOString(),
      page: "/dashboard/automate",
    });

    if (isDemoMode) {
      // Generate a unique ID for the new demo campaign
      const newId = campaigns.length ? Math.max(...campaigns.map((c) => c.id)) + 1 : 13;

      updateCampaigns([
        {
          id: newId,
          name: newCampaign.name,
          trending: "no",
          searchQuery: newCampaign.searchUrl || "",
          startDate: newCampaign.startDate || "",
          endDate: newCampaign.endDate || "",
          sent: 0,
          accepted: 0,
          pending: 0,
          invited: 0,
          responseRate: 0,
          status: "queued",
          campaign_type: newCampaign.sourceType === "csv" ? "csv" : "search",
          linkedin_url: newCampaign.searchUrl || "",
          connection_message: newCampaign.connectionMessage || "",
          follow_up_message: newCampaign.followUpMessage || "",
          second_follow_up_message: newCampaign.secondFollowUpMessage || "",
          follow_up_days: newCampaign.followUpDays || 2,
          second_follow_up_days: newCampaign.secondFollowUpDays || 4,
          cancelled: 0,
          start_date: newCampaign.startDate ? String(newCampaign.startDate) : "",
          end_date: newCampaign.endDate ? String(newCampaign.endDate) : "",
          // Optional metrics fields - all set to 0
          totalMessages: 0,
          dailyAverage: 0,
          weeklyGrowth: 0,
          weeklyData: [0, 0, 0, 0, 0, 0, 0],
        } as Campaign,
        ...campaigns,
      ]);
    } else {
      refreshCampaigns();
      setReloadKey((k) => k + 1);
    }
    setCurrentStep(1);
    setErrors({});
    setCampaignData({
      name: "",
      sourceType: "searchUrl" as "searchUrl" | "csv" | "likes" | "comments",
      searchUrl: "",
      connectionMessage: "",
      followUpMessage: "",
      secondFollowUpMessage: "",
      connectionMessageEnabled: false,
      followUpEnabled: true,
      secondFollowUpEnabled: false,
      followUpDays: 2,
      followUpHours: 0,
      secondFollowUpDays: 4,
      secondFollowUpHours: 0,
      dailyLimit: 20,
      weeklyLimit: 100,
      importLimit: 100,
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "17:00",
      hasEndDate: false,
    });
    // checkImportStatus(); // This is now handled by dashboard-init
  };

  // 3️⃣ The same height‐sync logic for the left column / recent activity
  useEffect(() => {
    const updateHeight = () => {
      if (leftColumnRef.current) {
        const leftColumnHeight = leftColumnRef.current.clientHeight;
        if (
          recentActivityHeight === null ||
          Math.abs(leftColumnHeight - recentActivityHeight) > 5
        ) {
          setRecentActivityHeight(leftColumnHeight);
        }
      }
    };

    updateHeight();
    requestAnimationFrame(() => {
      updateHeight();
      setTimeout(updateHeight, 100);
    });

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight);
    });

    if (leftColumnRef.current) {
      resizeObserver.observe(leftColumnRef.current);
    }

    const handleResize = () => {
      requestAnimationFrame(updateHeight);
    };
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateHeight();
        requestAnimationFrame(updateHeight);
        setTimeout(() => {
          updateHeight();
          requestAnimationFrame(updateHeight);
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(() => requestAnimationFrame(updateHeight), 5000);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [recentActivityHeight]);

  // Load campaign-specific metrics when selectedCampaign changes
  useEffect(() => {
    if (selectedCampaign && !isDemoMode) {
      setCampaignMetricsLoading(true);
      refreshCampaignMetrics(selectedCampaign.id.toString())
        .then((data) => {
          if (data && !data.error) {
            setSpecificCampaignMetrics(data);
          } else {
            console.error("Failed to load campaign metrics:", data?.error);
            setSpecificCampaignMetrics(null);
          }
        })
        .catch((error) => {
          console.error("Error loading campaign metrics:", error);
          setSpecificCampaignMetrics(null);
        })
        .finally(() => {
          setCampaignMetricsLoading(false);
        });
    } else {
      setSpecificCampaignMetrics(null);
      setCampaignMetricsLoading(false);
    }
  }, [selectedCampaign, isDemoMode, refreshCampaignMetrics]);

  // Check for modal parameter in URL to auto-open campaign modal
  useEffect(() => {
    const modalParam = searchParams.get("modal");
    if (modalParam === "create" && hasCredentials && !showNewCampaignModal) {
      setShowNewCampaignModal(true);
      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("modal");
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, hasCredentials, showNewCampaignModal, router]);

  // Track previous realtime metrics to detect actual changes
  const prevRealtimeMetricsRef = useRef<any>(null);

  // Auto-refresh campaign metrics when realtime updates occur
  useEffect(() => {
    if (selectedCampaign && !isDemoMode && specificCampaignMetrics && realtimeMetrics) {
      // Only refresh if realtime metrics have actually changed
      const prevMetrics = prevRealtimeMetricsRef.current;
      const currentMetrics = realtimeMetrics;

      // Check if metrics actually changed (not just initialized)
      if (
        prevMetrics &&
        (prevMetrics.totalImported !== currentMetrics.totalImported ||
          prevMetrics.totalSent !== currentMetrics.totalSent ||
          prevMetrics.accepted !== currentMetrics.accepted ||
          prevMetrics.pending !== currentMetrics.pending ||
          prevMetrics.totalMessages !== currentMetrics.totalMessages)
      ) {
        setCampaignMetricsLoading(true);
        refreshCampaignMetrics(selectedCampaign.id.toString())
          .then((data) => {
            if (data && !data.error) {
              setSpecificCampaignMetrics(data);
            }
          })
          .catch((error) => {
            console.error("Error refreshing campaign metrics:", error);
          })
          .finally(() => {
            setCampaignMetricsLoading(false);
          });
      }

      // Update the ref with current metrics
      prevRealtimeMetricsRef.current = currentMetrics;
    }
  }, [
    realtimeMetrics,
    selectedCampaign,
    isDemoMode,
    specificCampaignMetrics,
    refreshCampaignMetrics,
  ]);

  // 4️⃣ Check import/trial status (unchanged)
  // useEffect(() => {
  //   let mounted = true;

  //   checkImportStatus();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  // Compute aggregate metrics based on mode
  const aggregateMetrics = isDemoMode
    ? {
        ...demoMetrics,
        campaigns: demoCampaigns,
      }
    : {
        ...(realtimeMetrics || {
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
        }),
        campaigns: campaigns || [],
      };

  const campaignMetrics = selectedCampaign
    ? isDemoMode
      ? demoMetrics
      : specificCampaignMetrics || {
          totalImported: selectedCampaign.sent || 0,
          totalSent: selectedCampaign.sent || 0,
          accepted: selectedCampaign.accepted || 0,
          pending: selectedCampaign.pending || 0,
          acceptanceRate: selectedCampaign.sent
            ? parseFloat(((selectedCampaign.accepted / selectedCampaign.sent) * 100).toFixed(1))
            : 0,
          responseRate: selectedCampaign.sent
            ? parseFloat(
                (((selectedCampaign.accepted * 0.85) / selectedCampaign.sent) * 100).toFixed(1),
              )
            : 0,
          totalMessages: selectedCampaign.totalMessages || 0,
          messageConversionRate:
            selectedCampaign.sent && selectedCampaign.totalMessages
              ? parseFloat(
                  ((selectedCampaign.totalMessages / selectedCampaign.sent) * 100).toFixed(1),
                )
              : 0,
          dailyAverage:
            selectedCampaign.dailyAverage || Math.round((selectedCampaign.sent || 0) / 30),
          weeklyGrowth:
            selectedCampaign.weeklyGrowth || Math.round((selectedCampaign.accepted || 0) / 8),
          campaigns: [selectedCampaign],
          weeklyData: selectedCampaign.weeklyData || [0, 0, 0, 0, 0, 0, 0],
        }
    : isDemoMode
      ? {
          ...demoMetrics,
          campaigns: demoCampaigns,
        }
      : {
          ...realtimeMetrics,
          campaigns: campaigns,
        };

  // Show loading state if credentials are unknown or loading
  if (hasCredentials === null || isLoading) {
    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="flex-1 flex items-center justify-center bg-white -mx-8 -my-8 px-8 py-8">
          <div className="text-center">
            <LoadingSpinner size="xl" color="primary" text="Loading dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  // Show loading state after successful LinkedIn connection
  if (isConnectingLinkedIn) {
    return (
      <div
        className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-white z-[9999] flex items-center justify-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <LoadingSpinner
            size="xl"
            color="primary"
            text="LinkedIn Connected! Redirecting to dashboard..."
          />
        </div>
      </div>
    );
  }

  // If not connected, show only the LinkedIn connection prompt
  if (hasCredentials === false && !isLoading && !isDemoMode) {
    // console.log("🔗 Rendering dashboard with LinkedIn login prompt only");
    return (
      <div className="h-full flex flex-col min-h-0 dashboard-scroll-container scrollbar-hide">
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] px-4">
          {/* LinkedIn Connection Prompt */}
          <div
            className="bg-white p-8 border border-black/5 rounded-2xl text-center max-w-md w-full transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {/* Content */}
            {!showWarmupStep && !showCredentialsStep && (
              <div className="mb-6">
                <h3 className="font-aeonik text-2xl text-slate-900 mb-3 tracking-tight">
                  Connect Your LinkedIn Account
                </h3>
                <p className="text-slate-500 text-base font-aeonik font-light leading-relaxed mb-6">
                  Start safe, automated outreach that builds real relationships.
                </p>

                <div className="text-left">
                  <h4 className="font-aeonik text-lg text-slate-900 mb-4 tracking-tight">
                    What you'll unlock
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-900 font-medium text-sm">1.</span>
                      <p className="text-slate-600 text-sm font-aeonik leading-relaxed">
                        Import prospects from LinkedIn searches, events, or CSVs
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-900 font-medium text-sm">2.</span>
                      <p className="text-slate-600 text-sm font-aeonik leading-relaxed">
                        Send connection requests automatically
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-900 font-medium text-sm">3.</span>
                      <p className="text-slate-600 text-sm font-aeonik leading-relaxed">
                        Personalize follow-ups and track replies as they come in
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Button */}
            {showWarmupStep ? (
              <div className="w-full">
                <WarmupStep
                  onSkip={handleWarmupSkip}
                  onKeep={handleWarmupKeep}
                  isLoading={warmupLoading}
                />
              </div>
            ) : showCredentialsStep ? (
              <div className="w-full">
                <LinkedInIntegratedLogin
                  onSuccess={(cookies) => {
                    // Track successful LinkedIn connection
                    posthog.capture("linkedin_connected_successfully", {
                      source: "dashboard_prompt",
                      timestamp: new Date().toISOString(),
                      page: "/dashboard/automate",
                    });

                    setShowCredentialsStep(false);
                    setIsConnectingLinkedIn(true);
                    setHasCredentials(true);

                    // Refresh the page after a short delay to update the dashboard
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  }}
                  onError={(error) => {
                    console.error("LinkedIn connection error:", error);
                  }}
                  onClose={() => setShowCredentialsStep(false)}
                  userId={user?.user?.id}
                  inline={true}
                />
              </div>
            ) : (
              <button
                onClick={async () => {
                  posthog.capture("linkedin_connect_button_clicked", {
                    source: "dashboard_prompt",
                    timestamp: new Date().toISOString(),
                    page: "/dashboard/automate",
                  });

                  // Check if warmup modal should be shown
                  const shouldShow = await shouldShowWarmupModal();
                  if (shouldShow) {
                    setShowWarmupStep(true);
                  } else {
                    // If no need to show warmup - go directly to LinkedIn form
                    setShowCredentialsStep(true);
                  }
                }}
                className="px-8 py-3 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200 font-aeonik text-sm"
              >
                Sign in with LinkedIn
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Login Modal */}
        {showLinkedInLogin && (
          <LinkedInIntegratedLogin
            onSuccess={(cookies) => {
              // Track successful LinkedIn connection
              posthog.capture("linkedin_connected_successfully", {
                source: "dashboard_modal",
                timestamp: new Date().toISOString(),
                page: "/dashboard/automate",
              });

              setShowLinkedInLogin(false);
              setIsConnectingLinkedIn(true);
              setHasCredentials(true);

              // Refresh the page after a short delay to update the dashboard
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
            onError={(error) => {
              // console.error("LinkedIn connection error:", error);
            }}
            onClose={() => setShowLinkedInLogin(false)}
            userId={user?.user?.id}
          />
        )}
      </div>
    );
  }

  // If already connected or in demo mode, show the main dashboard
  if ((hasCredentials || isDemoMode) && !isLoading) {
    return (
      <div className="h-full flex flex-col min-h-0 dashboard-scroll-container scrollbar-hide">
        <div className="w-full flex flex-col gap-6 min-h-0 h-full dashboard-content-wrapper pb-12">
          {/* Campaign Context (only when campaign selected) */}
          <DashboardContext
            timeRange={timeRange}
            selectedCampaign={
              selectedCampaign
                ? {
                    id: selectedCampaign.id.toString(),
                    name: selectedCampaign.name,
                  }
                : null
            }
            onClearCampaign={() => setSelectedCampaign(null)}
          />

          {/* Metrics Dashboard */}
          <div
            className="flex-shrink-0 transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <MetricsDashboard
              metrics={
                selectedCampaign && specificCampaignMetrics
                  ? specificCampaignMetrics
                  : aggregateMetrics
              }
              isDemo={isDemoMode}
              isLoading={campaignMetricsLoading}
              isCampaignSelected={!!selectedCampaign}
              selectedCampaignId={selectedCampaign?.id?.toString()}
            />
          </div>

          {/* Connection Requests Chart */}
          <div
            className="flex-shrink-0 transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(20px)",
              transitionDelay: hasLoaded ? "100ms" : "0ms",
            }}
          >
            <ConnectionRequestsChart selectedCampaignId={selectedCampaign?.id?.toString()} />
          </div>

          {/* Main content area */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(30px)",
              transitionDelay: hasLoaded ? "200ms" : "0ms",
              height: "calc(100% - 2rem)",
              marginBottom: "2rem",
            }}
          >
            {/* Active Campaigns or Campaign Details */}
            <div
              className="bg-white rounded-2xl border border-black/5 min-h-0 lg:min-h-[700px] flex flex-col w-full min-w-0 transform transition-all duration-500 ease-out"
              style={{
                height: "calc(100% - 1rem)",
                marginBottom: "1rem",
                opacity: hasLoaded ? 1 : 0,
                transform: hasLoaded ? "scale(1)" : "scale(0.98)",
                transitionDelay: hasLoaded ? "300ms" : "0ms",
              }}
            >
              {selectedCampaign ? (
                <CampaignDetails
                  campaign={selectedCampaign}
                  onBack={() => setSelectedCampaign(null)}
                  onToggleCampaign={handleToggleCampaign}
                  refreshMetrics={refreshMetrics}
                />
              ) : (
                <CampaignList
                  key={reloadKey}
                  campaigns={campaigns}
                  setCampaigns={
                    updateCampaigns as (
                      campaigns: Campaign[] | ((prev: Campaign[]) => Campaign[]),
                    ) => void
                  }
                  onToggleCampaign={handleToggleCampaign}
                  onStartCampaign={handleStartCampaign}
                  importStatus={user.importStatus}
                  setShowNewCampaignModal={setShowNewCampaignModal}
                  setSelectedCampaign={(campaign: Campaign | null) => setSelectedCampaign(campaign)}
                  refreshMetrics={refreshMetrics}
                  blockActions={accessAllowed === false}
                />
              )}
            </div>
            {/* Recent Activity */}
            <div
              className="bg-white rounded-2xl border border-black/5 min-h-0 flex flex-col w-full min-w-0 transform transition-all duration-500 ease-out"
              style={{
                height: "calc(100% - 1rem)",
                marginBottom: "1rem",
                opacity: hasLoaded ? 1 : 0,
                transform: hasLoaded ? "scale(1)" : "scale(0.98)",
                transitionDelay: hasLoaded ? "400ms" : "0ms",
              }}
            >
              <RecentActivity selectedCampaignId={selectedCampaign?.id?.toString()} />
            </div>
          </div>
        </div>

        <CampaignModal
          showModal={showNewCampaignModal}
          onClose={() => {
            setShowNewCampaignModal(false);
            setSelectedCampaign(null);
            // Reset campaign data to initial state
            setCampaignData({
              name: "",
              sourceType: "searchUrl",
              searchUrl: "",
              connectionMessage: "",
              followUpMessage: "",
              secondFollowUpMessage: "",
              connectionMessageEnabled: false,
              followUpEnabled: true,
              secondFollowUpEnabled: false,
              followUpDays: 2,
              secondFollowUpDays: 4,
              dailyLimit: 100,
              weeklyLimit: 500,
              importLimit: 100,
              startDate: "",
              endDate: "",
              hasEndDate: false,
              followUpHours: 0,
              secondFollowUpHours: 0,
              startTime: "",
              endTime: "17:00",
            });
            setCurrentStep(1);
            setErrors({});
          }}
          onSuccess={handleCampaignCreated}
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    );
  }
}
