"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onKeep: () => void;
  userId?: string;
};

export function WarmupSkipModal({ isOpen, onClose, onSkip, onKeep, userId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSkip = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/limits/skip-warmup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to set skip");
      onSkip();
    } catch (e) {
      console.error("Skip warmup error:", e);
      alert("Failed to skip warmup. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleKeep = () => {
    onKeep();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg focus:outline-none focus:ring-0 [&>button]:hidden">
        <DialogHeader>
          <div className="flex flex-col items-start px-6 pt-6">
            <DialogTitle className="text-xl font-aeonik text-black">
              Skip warmup period?
            </DialogTitle>
            <DialogDescription className="font-outfit text-base text-black/80 mt-2">
              If you've been sending 20+ LinkedIn requests daily, we'll start you with higher limits right away.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSkip}
              disabled={loading}
              className="w-full font-outfit text-sm py-2.5 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Yes, skip warmup"
              )}
            </Button>

            <button
              onClick={handleKeep}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-outfit text-sm text-gray-600 border border-transparent hover:border-black/10 transition-all duration-200"
            >
              No, keep warmup
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
