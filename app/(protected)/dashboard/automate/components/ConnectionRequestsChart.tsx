import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading";
import { useDemoMode } from "@/app/context/demo-mode-context";
import { useTimeRange } from "./TimeRangeContext";
import { buildLocalDayBoundaries } from "@/lib/stats/timeRange";

interface ChartData {
  date: string;
  label: string;
  sent: number;
  accepted: number;
  messages: number;
  responses: number;
}

interface ConnectionRequestsChartProps {
  selectedCampaignId?: string | null;
}

// Demo data for the chart - generate current week's data
const generateDemoData = (): ChartData[] => {
  const today = new Date();
  const days = [];

  // Generate last 7 days including today
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = dayNames[day.getDay()];

    // Generate realistic demo data with some variation
    const baseSent = Math.floor(Math.random() * 15) + 8;
    const accepted = Math.floor(baseSent * (0.4 + Math.random() * 0.3)); // 40-70% acceptance rate
    const messages = Math.floor(accepted * (0.6 + Math.random() * 0.4)); // 60-100% message rate
    const responses = Math.floor(messages * (0.2 + Math.random() * 0.4)); // 20-60% response rate

    days.push({
      date: day.toISOString().split("T")[0],
      label: dayOfWeek,
      sent: baseSent,
      accepted: accepted,
      messages: messages,
      responses: responses,
    });
  }

  return days;
};

const demoChartData: ChartData[] = generateDemoData();

export function ConnectionRequestsChart({ selectedCampaignId }: ConnectionRequestsChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  const { timeRange } = useTimeRange();

  useEffect(() => {
    const fetchData = async () => {
      console.log("ConnectionRequestsChart: isDemoMode =", isDemoMode);
      if (isDemoMode) {
        console.log("Using demo data:", demoChartData);
        setData(demoChartData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { days, rangeStartUTC, rangeEndUTC } = buildLocalDayBoundaries(
          timeRange as "7d" | "30d" | "90d",
        );

        const body = {
          campaignId: selectedCampaignId ?? null,
          timeRange,
          days, // масив із межами кожного дня (UTC)
          rangeStartUTC, // межі всього діапазону (UTC)
          rangeEndUTC,
        };

        const response = await fetch("/api/connection-requests-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log("Connection requests chart data received:", result);
        setData(result.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch connection requests data:", err);
        console.error("Error details:", err);
        setError(
          `Failed to load chart data: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDemoMode, selectedCampaignId, timeRange]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sentData = payload.find((p: any) => p.dataKey === "sent");
      const acceptedData = payload.find((p: any) => p.dataKey === "accepted");
      const messagesData = payload.find((p: any) => p.dataKey === "messages");
      const responsesData = payload.find((p: any) => p.dataKey === "responses");

      return (
        <div className="bg-white border border-black/10 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-aeonik text-sm text-slate-900 mb-1">{label}</p>
          {sentData && (
            <p className="font-aeonik text-xs text-black">Requests Sent: {sentData.value}</p>
          )}
          {acceptedData && (
            <p className="font-aeonik text-xs text-black">
              Connections Made With Tiger: {acceptedData.value}
            </p>
          )}
          {messagesData && (
            <p className="font-aeonik text-xs text-black">Messages Sent: {messagesData.value}</p>
          )}
          {responsesData && (
            <p className="font-aeonik text-xs text-black">
              Responses Received: {responsesData.value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-black/5">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
          <div className="flex flex-col min-w-[180px]">
            <h2 className="text-xl font-aeonik text-slate-900 mb-1 tracking-tight">
              Daily Connection Activity
            </h2>
            <p className="text-slate-500 text-sm font-aeonik font-light">
              {selectedCampaignId
                ? "Last 7 days (selected campaign)"
                : "Last 7 days (all campaigns)"}
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="h-48 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-black/5">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
          <div className="flex flex-col min-w-[180px]">
            <h2 className="text-xl font-aeonik text-slate-900 mb-1 tracking-tight">
              Daily Connection Activity
            </h2>
            <p className="text-slate-500 text-sm font-aeonik font-light">
              {selectedCampaignId
                ? "Last 7 days (selected campaign)"
                : "Last 7 days (all campaigns)"}
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-aeonik">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const maxCount =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.sent, d.accepted, d.messages, d.responses || 0)), 1)
      : 1;
  const yAxisMax = maxCount === 0 ? 5 : Math.ceil(maxCount * 1.2); // Show 0-5 range when all values are 0

  // Show empty state if no data
  if (!loading && !error && data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
          <div className="flex flex-col min-w-[180px]">
            <h2 className="text-xl font-aeonik text-slate-900 mb-1 tracking-tight">
              Daily Connection Activity
            </h2>
            <p className="text-slate-500 text-sm font-aeonik font-light">
              {selectedCampaignId
                ? "Last 7 days (selected campaign)"
                : "Last 7 days (all campaigns)"}
            </p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-aeonik">
              No connection activity data available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5">
      {/* Header - matches MetricsDashboard pattern */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-4 flex-shrink-0 gap-6">
        <div className="flex flex-col min-w-[180px]">
          <h2 className="text-xl font-aeonik text-slate-900 mb-1 tracking-tight">
            Daily Connection Activity
          </h2>
          <p className="text-slate-500 text-sm font-aeonik font-light">
            {selectedCampaignId
              ? `Last ${timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days (selected campaign)`
              : `Last ${timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days (all campaigns)`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-aeonik">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }}></div>
            <span className="text-slate-600">Requests Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }}></div>
            <span className="text-slate-600">Connections Made With Tiger</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#8B5CF6" }}></div>
            <span className="text-slate-600">Messages Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
            <span className="text-slate-600">Responses Received</span>
          </div>
        </div>
      </div>

      {/* Chart content */}
      <div className="px-6 pb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#6B7280",
                  fontFamily: "var(--font-aeonik)",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#6B7280",
                  fontFamily: "var(--font-aeonik)",
                }}
                domain={[0, yAxisMax]}
                width={30}
                tickCount={yAxisMax + 1}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sent"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
                name="Requests Sent"
              />
              <Bar
                dataKey="accepted"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
                name="Connections Made With Tiger"
              />
              <Bar
                dataKey="messages"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
                name="Messages Sent"
              />
              <Bar
                dataKey="responses"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                maxBarSize={25}
                name="Responses Received"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
            <span className="text-slate-500 font-aeonik font-light">Total this week</span>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }}></div>
                <span className="font-aeonik text-slate-900 font-medium">
                  {data.reduce((sum, day) => sum + day.sent, 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }}></div>
                <span className="font-aeonik text-slate-900 font-medium">
                  {data.reduce((sum, day) => sum + day.accepted, 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#8B5CF6" }}></div>
                <span className="font-aeonik text-slate-900 font-medium">
                  {data.reduce((sum, day) => sum + day.messages, 0)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
                <span className="font-aeonik text-slate-900 font-medium">
                  {data.reduce((sum, day) => sum + (day.responses || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
