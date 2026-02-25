"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { aeonik } from "@/app/fonts/fonts";
import { Linkedin, Search, Music, UserPlus } from "lucide-react";
import { toast } from "sonner";
import PostHogClient from "@/lib/posthog";

interface OnboardingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

const referralOptions = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "google", label: "Google", icon: Search },
  { id: "tiktok", label: "TikTok", icon: Music },
  { id: "other", label: "Other", icon: UserPlus },
];

export function OnboardingOverlay({ isOpen, onComplete }: OnboardingOverlayProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [otherDetail, setOtherDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const posthog = PostHogClient();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedSource) {
      toast.error("Please select how you found us");
      return;
    }

    if (selectedSource === "other" && !otherDetail.trim()) {
      toast.error("Please tell us how you found us");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboarding/referral-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralSource: selectedSource,
          referralSourceDetail: selectedSource === "other" ? otherDetail : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save referral source");
      }

      // Track in PostHog
      posthog.capture("onboarding_referral_source_submitted", {
        referral_source: selectedSource,
        referral_source_detail: selectedSource === "other" ? otherDetail : null,
      });

      onComplete();
    } catch (error) {
      console.error("Error saving referral source:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Overlay Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border border-gray-200 bg-white rounded-lg shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2
                className={`${aeonik.variable} font-aeonik text-xl md:text-2xl font-semibold text-black mb-2`}
              >
                Welcome to Tiger!
              </h2>
              <p
                className={`${aeonik.variable} font-aeonik font-light text-sm text-black/70`}
              >
                How did you hear about us?
              </p>
            </div>

            {/* Referral Options */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {referralOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedSource === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedSource(option.id)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200
                      ${
                        isSelected
                          ? "border-[#0A66C2] bg-[#0A66C2]/5"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        isSelected ? "text-[#0A66C2]" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`${aeonik.variable} font-aeonik text-sm font-medium ${
                        isSelected ? "text-[#0A66C2]" : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Other Detail Input */}
            {selectedSource === "other" && (
              <div className="mb-5 animate-in slide-in-from-top duration-300">
                <Input
                  placeholder="Please specify..."
                  value={otherDetail}
                  onChange={(e) => setOtherDetail(e.target.value)}
                  className={`${aeonik.variable} font-aeonik bg-white h-10 rounded-lg border border-input focus:outline-none input-focus-gray text-sm`}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedSource}
              className={`${aeonik.variable} font-aeonik w-full h-10 text-sm bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl transition-all duration-200 disabled:opacity-50 font-medium`}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

