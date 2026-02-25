"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { createClient } from "@/utils/supabase/client";

interface WarmupStatus {
  isInWarmup: boolean;
  daysRemaining: number;
  isLoading: boolean;
}

export function useWarmupStatus(): WarmupStatus {
  const user = useUser();
  const [warmupStatus, setWarmupStatus] = useState<WarmupStatus>({
    isInWarmup: false,
    daysRemaining: 0,
    isLoading: true,
  });

  useEffect(() => {
    const checkWarmupStatus = async () => {
      if (!user?.user?.id) {
        setWarmupStatus({ isInWarmup: false, daysRemaining: 0, isLoading: false });
        return;
      }

      try {
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("created_at, trial_weeks, trial_week_skipped")
          .eq("id", user.user.id)
          .single();

        if (error || !profile) {
          console.error("Error fetching profile:", error);
          setWarmupStatus({ isInWarmup: false, daysRemaining: 0, isLoading: false });
          return;
        }

        const createdAt = new Date(profile.created_at);
        const now = new Date();
        const daysSinceSignup = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Determine warmup period based on trial_week_skipped
        const warmupWeeks = profile.trial_week_skipped ? 1 : 2;
        const warmupDays = warmupWeeks * 7;
        const daysRemaining = Math.max(0, warmupDays - daysSinceSignup);
        const isInWarmup = daysRemaining > 0;

        setWarmupStatus({
          isInWarmup,
          daysRemaining,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error checking warmup status:", error);
        setWarmupStatus({ isInWarmup: false, daysRemaining: 0, isLoading: false });
      }
    };

    checkWarmupStatus();
  }, [user?.user?.id]);

  return warmupStatus;
}
