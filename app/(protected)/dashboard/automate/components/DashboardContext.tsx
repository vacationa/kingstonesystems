import React from "react";
import { TimeRange } from "./TimeFilter";
import { X } from "lucide-react";

interface DashboardContextProps {
  timeRange: TimeRange;
  selectedCampaign?: {
    id: string;
    name: string;
  } | null;
  onClearCampaign?: () => void;
}

const timeRangeLabels = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export function DashboardContext({
  timeRange,
  selectedCampaign,
  onClearCampaign
}: DashboardContextProps) {
  if (!selectedCampaign) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <span className="text-sm font-medium text-blue-900">
          {selectedCampaign.name}
        </span>
        <span className="text-sm text-blue-700">•</span>
        <span className="text-sm text-blue-700">
          {timeRangeLabels[timeRange]}
        </span>
        {onClearCampaign && (
          <button
            onClick={onClearCampaign}
            className="ml-1 p-0.5 hover:bg-blue-100 rounded transition-colors"
            title="View all campaigns"
          >
            <X className="w-3 h-3 text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
}
