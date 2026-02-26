"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface WarmupStepProps {
  onSkip: () => void;
  onKeep: () => void;
  isLoading?: boolean;
  onContinue?: () => void;
}

export const WarmupStep: React.FC<WarmupStepProps> = ({ onSkip, onKeep, isLoading = false, onContinue }) => {
  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="text-center mb-6">
        <h3 className=" text-2xl text-gray-900 mb-3 tracking-tight">
          Skip Warmup?
        </h3>
        <p className="text-gray-500 text-base  font-light leading-relaxed">
          If you already send 20+ LinkedIn requests daily, Tiger can safely start you at higher limits right away.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="w-full px-6 py-2.5 bg-white text-gray-600 border border-black/10 rounded-xl hover:border-black/20 hover:bg-gray-50 transition-all duration-200  text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            "Yes, skip warmup"
          )}
        </button>

        <button
          onClick={onKeep}
          disabled={isLoading}
          className="w-full px-6 py-2.5 bg-white text-gray-600 border border-black/10 rounded-xl hover:border-black/20 hover:bg-gray-50 transition-all duration-200  text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          No, keep warmup
        </button>
      </div>
    </div>
  );
};