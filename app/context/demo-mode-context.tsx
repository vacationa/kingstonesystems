"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@/context/user-context";

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  clearDemoCampaigns: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

const ALLOWED_DEMO_EMAIL = "hangal@usc.edu";

export function DemoModeProvider({ children }: { children: ReactNode }) {
  /*
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('isDemoMode');
      if (stored === 'true') {
        setIsDemoMode(true);
      }
    } catch (e) {
      console.error("Failed to read demo mode from localStorage", e);
    }
  }, []);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const newVal = !prev;
      try {
        localStorage.setItem('isDemoMode', String(newVal));
      } catch (e) {
        // ignore
      }
      return newVal;
    });
  };

  const clearDemoCampaigns = () => {
    try {
      localStorage.removeItem('demo_campaigns');
    } catch (error) {
      console.error("Failed to clear demo campaigns:", error);
    }
  };
  */

  const isDemoMode = false;
  const toggleDemoMode = () => { };
  const clearDemoCampaigns = () => { };

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
