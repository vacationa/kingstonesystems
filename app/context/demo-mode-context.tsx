"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useUser } from "@/context/user-context";

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  clearDemoCampaigns: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

const ALLOWED_DEMO_EMAIL = "hangal@usc.edu";

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { user } = useUser();

  const toggleDemoMode = () => {
    if (user?.email === ALLOWED_DEMO_EMAIL) {
      setIsDemoMode(prev => !prev);
    } else {
      // Demo mode is restricted to authorized users
    }
  };

  const clearDemoCampaigns = () => {
    try {
      localStorage.removeItem('demo_campaigns');
    } catch (error) {
      console.error("Failed to clear demo campaigns:", error);
    }
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, clearDemoCampaigns }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
}
