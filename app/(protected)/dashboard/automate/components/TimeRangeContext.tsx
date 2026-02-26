import React, { createContext, useContext } from "react";
import { TimeRange } from "./TimeFilter";

interface TimeRangeContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | null>(null);

export function TimeRangeProvider({ 
  children, 
  timeRange, 
  setTimeRange 
}: { 
  children: React.ReactNode;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}) {
  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  );
}

export function useTimeRange() {
  const context = useContext(TimeRangeContext);
  if (!context) {
    throw new Error("useTimeRange must be used within a TimeRangeProvider");
  }
  return context;
}
