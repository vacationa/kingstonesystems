// components/MetricsDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Send,
  Download,
  Percent,
  MessageSquare,
  Check,
  UserPlus,
  Handshake,
  BarChart3,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { LoadingDots, LoadingSpinner } from "@/components/ui/loading";
import { useRealtime } from "@/app/context/realtime-context";
import PostHogClient from "@/lib/posthog";
import { useTimeRange } from "./TimeRangeContext";

function Spinner() {
  // now a <span> not a <div>
  return (
    <span
      className="inline-block h-4 w-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"
      role="status"
      aria-label="loading"
    />
  );
}

interface Metrics {
  totalImported: number;
  totalSent: number;
  accepted: number;
  pending: number;
  replied: number;
  totalMessages: number;
  acceptanceRate: number;
  responseRate: number;
  dailyAverage: number;
  weeklyGrowth: number;
  weeklyData: number[];
}

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
    campaigns: any[];
    weeklyData: number[];
  };
  isDemo?: boolean;
  isLoading?: boolean;
  isCampaignSelected?: boolean;
  selectedCampaignId?: string | null;
}

export function MetricsDashboard({
  metrics,
  isDemo = false,
  isLoading = false,
  isCampaignSelected = false,
  selectedCampaignId = null,
}: MetricsDashboardProps) {
  const [metricsState, setMetricsState] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCampaignMetrics, setHasCampaignMetrics] = useState(false);
  const posthog = PostHogClient();
  const { timeRange } = useTimeRange();

  // Use real-time context for live metrics
  const { metrics: realtimeMetrics } = useRealtime();

  // Track metrics dashboard interactions
  const trackMetricClick = (metricName: string, metricValue: number | string) => {
    posthog.capture('metrics_dashboard_clicked', {
      metric_name: metricName,
      metric_value: metricValue,
      is_demo: isDemo,
      is_campaign_selected: isCampaignSelected,
      timestamp: new Date().toISOString(),
      component: 'MetricsDashboard',
    });
  };

  useEffect(() => {
    // Reset campaign metrics flag when campaign is deselected
    if (!isCampaignSelected) {
      setHasCampaignMetrics(false);
      setMetricsState(null); // Reset metrics state when campaign is deselected
    }

    // If in demo mode, use the metrics passed as props
    if (isDemo) {
      setMetricsState({
        totalImported: metrics.totalImported,
        totalSent: metrics.totalSent,
        accepted: metrics.accepted,
        pending: metrics.pending,
        replied: 0, // Not in demo metrics
        totalMessages: metrics.totalMessages,
        acceptanceRate: metrics.acceptanceRate,
        responseRate: metrics.responseRate,
        dailyAverage: metrics.dailyAverage,
        weeklyGrowth: metrics.weeklyGrowth,
        weeklyData: metrics.weeklyData,
      });
      setLoading(false);
      setError(null);
      return;
    }

    // If campaign-specific metrics are passed (not aggregate), use them
    if (metrics && !metrics.campaigns) {
      setMetricsState({
        totalImported: metrics.totalImported,
        totalSent: metrics.totalSent,
        accepted: metrics.accepted,
        pending: metrics.pending,
        replied: 0, // Not in campaign metrics
        totalMessages: metrics.totalMessages,
        acceptanceRate: metrics.acceptanceRate,
        responseRate: metrics.responseRate,
        dailyAverage: metrics.dailyAverage,
        weeklyGrowth: metrics.weeklyGrowth,
        weeklyData: metrics.weeklyData,
      });
      setLoading(false);
      setError(null);
      setHasCampaignMetrics(true);
      return;
    }

    // Use real-time metrics if available and no props passed (only for aggregate metrics)
    if (
      realtimeMetrics &&
      (!metrics || metrics.campaigns) &&
      !isCampaignSelected &&
      !hasCampaignMetrics
    ) {
      setMetricsState({
        totalImported: realtimeMetrics.totalImported || 0,
        totalSent: realtimeMetrics.totalSent || 0,
        accepted: realtimeMetrics.accepted || 0,
        pending: realtimeMetrics.pending || 0,
        replied: realtimeMetrics.replied || 0,
        totalMessages: realtimeMetrics.totalMessages || 0,
        acceptanceRate: realtimeMetrics.acceptanceRate || 0,
        responseRate: realtimeMetrics.responseRate || 0,
        dailyAverage: realtimeMetrics.dailyAverage || 0,
        weeklyGrowth: realtimeMetrics.weeklyGrowth || 0,
        weeklyData: realtimeMetrics.weeklyData || [0, 0, 0, 0, 0, 0, 0],
      });
      setLoading(false);
      setError(null);
      return;
    }

    // Fallback to API fetch if no real-time data and no props
    if (!metrics && !isCampaignSelected && !hasCampaignMetrics) {
      fetch("/api/metrics")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Status ${res.status}`);
          }
          return res.json();
        })
        .then((data: Metrics) => {
          setMetricsState(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [isDemo, metrics, realtimeMetrics, isCampaignSelected, hasCampaignMetrics]);

  // Add effect to refresh campaign metrics when realtime updates occur
  useEffect(() => {
    if (isCampaignSelected && hasCampaignMetrics && realtimeMetrics) {
      // Trigger a refresh of campaign metrics when realtime updates occur
      // This will be handled by the parent component through the refreshCampaignMetrics function
    }
  }, [realtimeMetrics, isCampaignSelected, hasCampaignMetrics]);


  // helper: show spinner, error placeholder, or value
  const renderValue = (val: number | undefined, decimals = 0, isPct = false) => {
    if (loading) return <LoadingDots size="sm" color="primary" />;
    if (error) return <span className="text-slate-400">—</span>;
    const num = val ?? 0;
    const str = isPct ? `${num.toFixed(decimals)}%` : num.toFixed(decimals);
    return <>{str}</>;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-2xl border border-black/10">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl text-slate-900 tracking-tight">Performance</h2>
            <Link
              href="/dashboard/settings?tab=guardrails"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 group relative"
              title="LinkedIn Limits & Settings"
            >
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
              <Shield size={16} />
              <span className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                LinkedIn Limits
              </span>
            </Link>
          </div>
          <p className="text-slate-500 text-sm font-light">Track your growth</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full">
          <div className="flex-1 pl-4">
            <div className="flex flex-row gap-20 overflow-x-auto items-start justify-between">
              <Card label="Contacts Imported">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.totalImported)
                )}
              </Card>
              <Card label="Requests Sent">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.totalSent)
                )}
              </Card>
              <Card label="Connections Made">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.accepted)
                )}
              </Card>
              <Card label="Messages Sent">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.totalMessages)
                )}
              </Card>
              <Card label="Acceptance Rate">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.acceptanceRate, 1, true)
                )}
              </Card>
              <Card label="Response Rate">
                {isLoading ? (
                  <LoadingDots size="sm" color="primary" />
                ) : (
                  renderValue(metricsState?.responseRate, 1, true)
                )}
              </Card>
            </div>
          </div>
          {/* Network Growth Section */}
          <div className="flex flex-col items-center justify-center gap-1 min-w-[140px] ml-8 py-3 px-4 bg-slate-50/50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
              <h3 className="text-xs text-slate-600 font-medium whitespace-nowrap">Network Growth</h3>
            </div>
            <div className="text-xl text-slate-900 tracking-tight text-center font-semibold">
              {isLoading ? (
                <LoadingDots size="sm" color="primary" />
              ) : (
                `+${metricsState?.accepted || 0}`
              )}
            </div>
            <p className="text-xs text-slate-500  text-center leading-tight">
              Total connections made
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-slate-600 text-sm p-4 bg-slate-50 border-b border-slate-100  text-center">
          <p className="font-medium mb-1">Metrics unavailable</p>
          <p className="text-xs text-slate-500">Please try refreshing the page</p>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  label: string;
  children: React.ReactNode;
}

function Card({ label, children }: CardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <h3 className="text-xs text-slate-500  text-center mb-2">{label}</h3>
      <div className="text-base text-slate-900 tracking-tight text-center mt-1 font-semibold">
        {children}
      </div>
    </div>
  );
}
