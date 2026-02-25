"use client";

import { ReactNode } from "react";
import { DemoModeProvider } from "@/app/context/demo-mode-context";
import { RealtimeProvider } from "@/app/context/realtime-context";
import { UserProvider } from "@/context/user-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <DemoModeProvider>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </DemoModeProvider>
    </UserProvider>
  );
}
