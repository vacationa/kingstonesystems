import React from "react";
import { cn } from "@/lib/utils";

export type TimeRange = "7d" | "30d" | "90d";

interface TimeFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  className?: string;
}

const timeRangeOptions = [
  { value: "7d" as TimeRange, label: "7 days" },
  { value: "30d" as TimeRange, label: "30 days" },
  { value: "90d" as TimeRange, label: "90 days" },
];

export function TimeFilter({ selectedRange, onRangeChange, className }: TimeFilterProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-slate-50 rounded-lg p-1", className)}>
      {timeRangeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onRangeChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-sm  font-medium rounded-md transition-all duration-200",
            selectedRange === option.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
