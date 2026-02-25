"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PricingPeriod = "monthly" | "annual";

const prices = {
  monthly: 39,
  annual: 29,
} as const;

const savings = {
  monthly: 0,
  annual: Math.round((1 - 29 / 39) * 100),
};

const yearlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_3cI00j8KrguveR35hFc3m04"
    : "https://buy.stripe.com/28EcN50dVemngZb11pc3m0a";
const monthlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_9B64gz5yf7XZ10ddObc3m05"
    : "https://buy.stripe.com/3cIaEXbWDcef5gt25tc3m08";

const features = [
  {
    title: "Built-In LinkedIn Protection",
    description:
      "Daily limits auto-adjust with random delays and scrolling. Your activity looks human and stays under LinkedIn's radar.",
  },
  {
    title: "Unlimited Campaigns & Messages",
    description:
      "Scale your way. Run unlimited campaigns and outreach volume. Tiger ramps things up safely so you can grow without risking bans.",
  },
  {
    title: "Import From Anywhere",
    description:
      "Plug in LinkedIn searches, Sales Navigator, CSVs, events, post likes, or comments. If they're on LinkedIn, you'll reach them.",
  },
  {
    title: "Smart Features",
    description:
      "Tiger pauses when someone replies, never double-messages, and gives you clear insights that help you sell more.",
  },
  {
    title: "Withdraw Old Requests",
    description: "Automatically withdraw pending requests after 30 days",
  },
  {
    title: "White-Glove Support",
    description: "Direct access to founder via LinkedIn.",
  },
];

const getPaymentLink = (period: PricingPeriod, userEmail: string | null) => {
  const baseUrl = period === "annual" ? yearlyPaymentLink : monthlyPaymentLink;
  return userEmail ? `${baseUrl}?prefilled_email=${encodeURIComponent(userEmail)}` : baseUrl;
};

interface SubscriptionDialogProps {
  userEmail: string | null;
  children: React.ReactNode;
}

export function SubscriptionDialog({ userEmail, children }: SubscriptionDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PricingPeriod>("monthly");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-[95%] max-h-[95vh] rounded-2xl bg-white p-0 border border-black/10 shadow-lg">
        <DialogHeader>
          <div className="flex flex-col items-start px-6 pt-5">
            <DialogTitle className="text-lg font-outfit text-black">
              Choose Your Plan
            </DialogTitle>
          </div>
        </DialogHeader>

          <div className="flex flex-col gap-4 px-6 pb-6 overflow-y-auto min-h-0">
            {/* Billing Toggle */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="grid grid-cols-2 gap-3 w-full">
                {(["monthly", "annual"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      "relative px-4 py-2.5 rounded-lg font-outfit text-sm transition-all flex flex-col items-center",
                      selectedPeriod === period
                        ? "text-black border border-black/10 bg-gray-50"
                        : "text-gray-600 border border-transparent hover:border-black/10",
                    )}
                  >
                    <span className="font-medium">
                      {period === "monthly" ? "Monthly" : "Annual"}
                    </span>
                    {period === "monthly" ? (
                      <span className="text-xs mt-0.5 text-gray-500">Full price</span>
                    ) : (
                      <span className="text-xs mt-0.5 font-medium text-[#0A66C2]">
                        Save {savings[period]}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedPeriod === "annual" && (
                <p className="text-xs font-outfit text-gray-500">
                  Save 26% vs monthly
                </p>
              )}
            </div>

            {/* Price Display */}
            <div className="text-center">
              <motion.div
                key={selectedPeriod}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative inline-block"
              >
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-2xl font-medium text-gray-600">$</span>
                  <span className="text-5xl font-bold text-black font-outfit">
                    {selectedPeriod === "annual" ? 348 : prices[selectedPeriod]}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-lg text-gray-600">
                      {selectedPeriod === "annual" ? "/year" : "/mo"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Features */}
            <div className="w-full border border-black/10 rounded-lg p-4">
              <div className="flex flex-col gap-2.5">
                {features.map((feature, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-outfit text-black font-medium leading-tight">{feature.title}</span>
                      <Check className="w-4 h-4 shrink-0 text-[#0A66C2]" strokeWidth={2} />
                    </div>
                    <p className="text-xs font-outfit text-gray-500 leading-tight">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <Link className="block" href={getPaymentLink(selectedPeriod, userEmail)}>
                <Button
                  variant="outline"
                  className="w-full font-outfit text-base px-5 py-3 !bg-transparent !text-[#0A66C2] hover:!bg-[#0A66C2] hover:!text-white !border !border-[#0A66C2] !rounded-lg !shadow-none transition-all duration-200"
                  size="default"
                >
                  <span className="flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Link>

              {/* 100% Satisfaction Guarantee */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-outfit font-medium">
                <svg
                  className="w-3.5 h-3.5 text-[#0A66C2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.75 12L10.58 14.83L16.25 9.17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>100% satisfaction guarantee • 30-day refund</span>
              </div>

              <div className="flex items-center justify-center text-xs text-gray-500 font-outfit">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
