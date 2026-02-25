"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bug, MessageSquare, Lightbulb, AlertTriangle, CheckCircle, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = "bug" | "feature" | "general" | "improvement";

const feedbackTypes = [
  {
    id: "bug" as FeedbackType,
    label: "Bug Report",
    description: "Report a problem",
    icon: Bug,
  },
  {
    id: "feature" as FeedbackType,
    label: "Feature Request", 
    description: "Suggest new functionality",
    icon: Lightbulb,
  },
  {
    id: "improvement" as FeedbackType,
    label: "Improvement",
    description: "Enhance existing features",
    icon: AlertTriangle,
  },
  {
    id: "general" as FeedbackType,
    label: "General Feedback",
    description: "Share your thoughts",
    icon: MessageSquare,
  },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setScreenshot(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setScreenshotUrl(data.data.url);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload screenshot");
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      alert("Failed to upload screenshot. Please try again.");
      setScreenshot(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    const trimmedDetails = details.trim();
    if (!selectedType || !trimmedDetails || trimmedDetails.length < 5) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          details: trimmedDetails,
          screenshot_url: screenshotUrl,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // You could add error state handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    setDetails("");
    setIsSubmitting(false);
    setIsSubmitted(false);
    setScreenshot(null);
    setScreenshotUrl(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-black" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-outfit text-black mb-2">Thank you</h3>
            <p className="text-sm font-outfit text-gray-600 text-center">
              Your feedback has been submitted
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0">
        <DialogHeader>
          <div className="flex flex-col items-start px-6 pt-6">
            <DialogTitle className="text-lg font-outfit text-black">
              Feedback
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 pb-6">
          {!selectedType ? (
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-black/10 hover:border-black/20 transition-all duration-200 text-center group bg-white"
                  >
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors" strokeWidth={1.25} />
                    <div>
                      <div className="font-outfit font-medium text-black text-sm mb-1">
                        {type.label}
                      </div>
                      <div className="font-outfit text-gray-500 text-xs leading-tight">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 pb-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-1 text-sm font-outfit text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  Back
                </button>
              </div>

              <div>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Share your feedback (at least 5 characters)..."
                  className="min-h-[120px] font-outfit text-sm resize-none border-black/10 focus:border-black/20 rounded-xl"
                />
                <div className="flex justify-end mt-2">
                  <span className="text-xs font-outfit text-gray-400">
                    {details.length}/1000
                  </span>
                </div>
              </div>

              {/* Screenshot Upload Section */}
              <div>
                <label className="text-sm font-outfit text-gray-700 mb-2 block">
                  Screenshot (optional)
                </label>
                
                {!screenshot ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex flex-col items-center gap-2 w-full text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                      ) : (
                        <Upload className="h-6 w-6" strokeWidth={1.5} />
                      )}
                      <span className="text-sm font-outfit">
                        {isUploading ? "Uploading..." : "Click to upload screenshot"}
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, GIF, WebP (max 5MB)
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-outfit text-gray-700 truncate">
                          {screenshot.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={removeScreenshot}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Remove screenshot"
                      >
                        <X className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!details.trim() || details.trim().length < 5 || isSubmitting || isUploading}
                  className="w-full font-outfit text-sm py-2.5 rounded-xl bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : isUploading ? "Uploading..." : "Send Feedback"}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-outfit text-sm text-gray-600 border border-transparent hover:border-black/10 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
