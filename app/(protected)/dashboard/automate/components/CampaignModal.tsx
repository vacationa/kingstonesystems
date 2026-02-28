import { useState, Dispatch, SetStateAction, RefObject, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDemoMode } from "@/app/context/demo-mode-context";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/context/user-context";
import PostHogClient from "@/lib/posthog";

import {
  X,
  AlertCircle,
  Calendar,
  Info,
  Search,
  FileText,
  Heart,
  MessageCircle,
  Users,
  Briefcase,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { cn } from "@/lib/utils";

import { formatUrlForDisplay } from "@/utils/utils";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// @ts-ignore
import Papa from "papaparse";

import { useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface CampaignData {
  name: string;

  sourceType: "searchUrl" | "csv" | "likes" | "comments" | "event" | "salesNavigator";

  searchUrl: string;

  connectionMessage: string;

  followUpMessage: string;

  secondFollowUpMessage: string;

  connectionMessageEnabled: boolean;

  followUpEnabled: boolean;

  secondFollowUpEnabled: boolean;

  followUpDays: number;

  secondFollowUpDays: number;

  dailyLimit: number;

  weeklyLimit: number;

  importLimit: number;

  startDate: string;

  endDate: string;

  hasEndDate: boolean;

  followUpHours: number;

  secondFollowUpHours: number;

  startTime: string;

  endTime: string;
}

interface CampaignModalProps {
  showModal: boolean;

  onSuccess: (campaignData: CampaignData) => void;

  onClose: () => void;

  campaignData: CampaignData;

  setCampaignData: Dispatch<SetStateAction<CampaignData>>;

  currentStep: number;

  setCurrentStep: (step: number) => void;

  errors: {
    name?: string;

    sourceType?: string;

    searchUrl?: string;

    connectionMessage?: string;

    followUpMessage?: string;

    secondFollowUpMessage?: string;

    importLimit?: string;

    startDate?: string;
  };

  setErrors: Dispatch<
    SetStateAction<{
      name?: string;

      sourceType?: string;

      searchUrl?: string;

      connectionMessage?: string;

      followUpMessage?: string;

      secondFollowUpMessage?: string;

      importLimit?: string;

      startDate?: string;
    }>
  >;
}

const steps = [
  { number: 1, title: "Source", description: "Choose your data source" },

  { number: 2, title: "Import", description: "Select your target audience" },

  { number: 3, title: "Message", description: "Personalize your outreach" },

  { number: 4, title: "Start", description: "Name and launch your campaign" },
];

const sourceOptions = [
  {
    id: "searchUrl",

    title: "LinkedIn Search",

    description: "Import people directly from any LinkedIn search URL.",

    icon: Search,

    color: "bg-blue-50 border-blue-200 text-blue-700",
  },

  {
    id: "csv",

    title: "CSV Upload",

    description: "Upload a CSV of prospects to import your own list.",

    icon: FileText,

    color: "bg-green-50 border-green-200 text-green-700",
  },

  {
    id: "likes",

    title: "Post Likes",

    description: "Target users who liked a specific LinkedIn post.",

    icon: Heart,

    color: "bg-red-50 border-red-200 text-red-700",
  },

  {
    id: "comments",

    title: "Post Comments",

    description: "Target users who commented on a specific LinkedIn post.",

    icon: MessageCircle,

    color: "bg-purple-50 border-purple-200 text-purple-700",
  },

  {
    id: "event",

    title: "Event Attendees",

    description: "Import people who registered for or attended a LinkedIn event.",

    icon: Users,

    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },

  {
    id: "salesNavigator",

    title: "Sales Navigator",

    description: "Import leads from your Sales Navigator lists or searches.",

    icon: Briefcase,

    color: "bg-slate-50 border-slate-200 text-slate-700",
  },
];

// Add helper for LinkedIn profile URL validation

const isValidLinkedInUrl = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/.test(url.trim());

// Add helper for Sales Navigator URL validation
const isValidSalesNavigatorUrl = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/sales\/search\/people/.test(url.trim());

export function CampaignModal({
  showModal,

  onClose,

  onSuccess,

  campaignData,

  setCampaignData,

  currentStep,

  setCurrentStep,

  errors,

  setErrors,
}: CampaignModalProps) {
  // All hooks must be called at the top, before any early returns

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { isDemoMode } = useDemoMode();
  const posthog = PostHogClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [csvAllData, setCsvAllData] = useState<string[][] | null>(null);

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const [csvColumnMap, setCsvColumnMap] = useState<{ [key: string]: string }>({});

  const [isClosing, setIsClosing] = useState(false);
  const [showWarmupWarning, setShowWarmupWarning] = useState(false);

  // Sales Navigator check states
  const [isCheckingSalesNav, setIsCheckingSalesNav] = useState(false);
  const [salesNavStatus, setSalesNavStatus] = useState<
    "unknown" | "checking" | "available" | "unavailable"
  >("unknown");
  const user = useUser();
  const supabase = createClient();

  useEffect(() => {
    const checkAccountAge = async () => {
      if (!user?.user?.id) return;

      // Check if user has dismissed the warning
      const dismissedKey = `warmup-warning-dismissed-${user.user.id}`;
      const isDismissed = localStorage.getItem(dismissedKey);
      if (isDismissed) {
        setShowWarmupWarning(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.user.id)
        .single();

      if (profile?.created_at) {
        const createdAt = new Date(profile.created_at);
        const now = new Date();
        const daysSinceSignup = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );
        setShowWarmupWarning(daysSinceSignup <= 14); // Show warning for first 2 weeks
      }
    };

    checkAccountAge();
  }, [user]);

  const handleDismissWarning = () => {
    if (user?.user?.id) {
      const dismissedKey = `warmup-warning-dismissed-${user.user.id}`;
      localStorage.setItem(dismissedKey, "true");
    }
    setShowWarmupWarning(false);
  };

  // Check Sales Navigator access
  const checkSalesNavigatorAccess = async () => {
    if (!user?.user?.id) return false;

    setIsCheckingSalesNav(true);
    setSalesNavStatus("checking");

    try {
      const response = await fetch("/api/check-sales-navigator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.user.id }),
      });

      const data = await response.json();

      if (data.hasAccess) {
        setSalesNavStatus("available");
        return true;
      } else {
        setSalesNavStatus("unavailable");
        return false;
      }
    } catch (error) {
      console.error("Error checking Sales Navigator access:", error);
      setSalesNavStatus("unavailable");
      return false;
    } finally {
      setIsCheckingSalesNav(false);
    }
  };

  // Reset Sales Navigator status when source type changes
  useEffect(() => {
    if (campaignData.sourceType !== "salesNavigator") {
      setSalesNavStatus("unknown");
      setIsCheckingSalesNav(false);
    }
  }, [campaignData.sourceType]);

  // Reset Sales Navigator status when modal closes
  useEffect(() => {
    if (!open) {
      setSalesNavStatus("unknown");
      setIsCheckingSalesNav(false);
    }
  }, [open]);

  // Update CSV preview when importLimit changes (if CSV is already loaded)
  useEffect(() => {
    if (campaignData.sourceType === "csv" && csvAllData && csvAllData.length > 1) {
      const importLimit = campaignData.importLimit;
      const totalRowsInFile = csvAllData.length - 1; // Exclude header
      const maxPreviewRows = importLimit
        ? Math.min(importLimit, 25) // Show up to 25 or importLimit, whichever is smaller
        : 25; // Default to 25 if no limit set
      const previewRows = Math.min(maxPreviewRows + 1, csvAllData.length); // +1 for header

      // Update preview to match the new limit
      setCsvPreview(csvAllData.slice(0, previewRows));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignData.importLimit, campaignData.sourceType]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const connectionMessageRef = useRef<HTMLTextAreaElement>(null);

  const followUpMessageRef = useRef<HTMLTextAreaElement>(null);

  const secondFollowUpMessageRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    // Track modal close
    posthog.capture("campaign_modal_closed", {
      current_step: currentStep,
      total_steps: steps.length,
      completed: false,
      campaign_name_filled: !!campaignData.name,
      source_type_selected: !!campaignData.sourceType,
      is_demo: isDemoMode,
      timestamp: new Date().toISOString(),
      component: "CampaignModal",
    });

    setIsClosing(true);

    setTimeout(() => {
      setIsClosing(false);

      onClose();
    }, 300); // Match the animation duration
  };

  if (!showModal && !isClosing) return null;

  const isLastStep = currentStep === steps.length;

  const isFirstStep = currentStep === 1;

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Real-time URL validation
  const validateUrlInRealTime = (url: string): string => {
    if (!url) return "";
    if (!isValidUrl(url)) {
      return "Please enter a valid URL (e.g., https://www.linkedin.com/...)";
    }
    if (!url.includes("linkedin.com")) {
      return "Please enter a valid LinkedIn URL";
    }
    if (campaignData.sourceType === "salesNavigator" && !isValidSalesNavigatorUrl(url)) {
      return "Please enter a valid Sales Navigator URL (e.g., https://www.linkedin.com/sales/search/people/...)";
    }
    return "";
  };

  const handleSubmit = async () => {
    if (!isLastStep) {
      if (currentStep === 1 && campaignData.sourceType === "salesNavigator") {
        const hasAccess = await checkSalesNavigatorAccess();
        if (!hasAccess) {
          return;
        }
      }

      // Track step progression
      posthog.capture("campaign_modal_step_advanced", {
        from_step: currentStep,
        to_step: Math.min(currentStep + 1, steps.length),
        step_name: steps[currentStep - 1]?.title || `Step ${currentStep}`,
        is_demo: isDemoMode,
        timestamp: new Date().toISOString(),
        component: "CampaignModal",
      });

      setCurrentStep(Math.min(currentStep + 1, steps.length));

      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Validate required fields
    const newErrors = {
      name: !campaignData.name ? "Campaign name is required" : "",
      sourceType: !campaignData.sourceType ? "Source type is required" : "",
      searchUrl: "",
      connectionMessage: "",
      followUpMessage:
        campaignData.followUpEnabled && !campaignData.followUpMessage
          ? "First follow-up message is required when enabled"
          : "",
      secondFollowUpMessage:
        campaignData.secondFollowUpEnabled &&
        campaignData.followUpEnabled &&
        !campaignData.secondFollowUpMessage
          ? "Second follow-up message is required when enabled"
          : "",
      importLimit: !campaignData.importLimit ? "Number of prospects is required" : "",
    };

    // URL validation for non-CSV campaigns
    if (campaignData.sourceType !== "csv") {
      if (!campaignData.searchUrl) {
        newErrors.searchUrl = "LinkedIn URL is required";
      } else if (!isValidUrl(campaignData.searchUrl)) {
        newErrors.searchUrl =
          "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/...)";
      } else if (!campaignData.searchUrl.includes("linkedin.com")) {
        newErrors.searchUrl = "Please enter a valid LinkedIn URL";
      }
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      // Validation errors found

      toast.error("Please fix the validation errors before continuing");

      return;
    }

    // Track campaign submission attempt
    posthog.capture("campaign_submission_started", {
      campaign_name: campaignData.name,
      source_type: campaignData.sourceType,
      follow_up_enabled: campaignData.followUpEnabled,
      connection_message_enabled: campaignData.connectionMessageEnabled,
      daily_limit: campaignData.dailyLimit,
      is_demo: isDemoMode,
      timestamp: new Date().toISOString(),
      component: "CampaignModal",
    });

    setIsSubmitting(true);

    try {
      const startDate = campaignData.startDate || new Date().toLocaleDateString("en-CA");

      const startTime =
        campaignData.startTime ||
        (() => {
          const now = new Date();

          return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        })();

      const startDateTime = startDate
        ? (() => {
            const localDateTime = new Date(`${startDate}T${startTime}:00`);
            return localDateTime.toISOString(); // Автоматична конвертація в UTC
          })()
        : new Date().toISOString();

      const endDateTime = campaignData.endDate
        ? (() => {
            const localDateTime = new Date(`${campaignData.endDate}T${campaignData.endTime}:00`);
            return localDateTime.toISOString(); // Автоматична конвертація в UTC
          })()
        : null;

      let campaign_type: string;

      switch (campaignData.sourceType) {
        case "searchUrl":
          campaign_type = "search";

          break;

        case "csv":
          campaign_type = "csv";

          break;

        case "likes":
          campaign_type = "reactions";

          break;

        case "comments":
          campaign_type = "comments";

          break;

        case "event":
          campaign_type = "event";

          break;

        case "salesNavigator":
          campaign_type = "sales_navigator";

          break;

        default:
          campaign_type = "";
      }

      // 1️⃣  Collect the mapped rows *only if* the source is CSV

      let mappedRows: Array<Record<string, string>> = [];

      if (campaignData.sourceType === "csv" && csvAllData) {
        // slice(1) to skip the header row - limit to importLimit for efficiency
        const dataRows = csvAllData.slice(1); // All rows without header
        const limit = campaignData.importLimit || dataRows.length;
        const rowsToProcess = dataRows.slice(0, limit); // Limit to importLimit

        mappedRows = rowsToProcess.map((row) => {
          const obj: Record<string, string> = {};

          // For each visible header -> mapped field in csvColumnMap

          Object.entries(csvColumnMap).forEach(([header, mappedField]) => {
            if (!mappedField || mappedField === "ignore") return; // skip ignored / unmapped

            const colIndex = csvHeaders.indexOf(header);

            obj[mappedField] = row[colIndex] || "";
          });

          return obj;
        });
      }

      let data;

      if (isDemoMode) {
        // Handle demo mode - simulate successful campaign creation
        data = {
          message: "Demo campaign created successfully!",
          campaign: {
            id: Date.now(), // Use timestamp as demo ID
            name: campaignData.name,
            status: "queued",
          },
        };
        toast.success(data.message);
      } else {
        // Handle real mode - make actual API call
        const response = await fetch("/api/scale/create", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: campaignData.name,

            linkedinUrl: campaignData.searchUrl,

            connectionMessage: campaignData.connectionMessage,

            followUpMessage: campaignData.followUpMessage,

            secondFollowUpMessage: campaignData.secondFollowUpMessage,

            connectionMessageEnabled: campaignData.connectionMessageEnabled,

            followUpEnabled: campaignData.followUpEnabled,

            secondFollowUpEnabled: campaignData.secondFollowUpEnabled,

            followUpDays: campaignData.followUpDays,

            followUpHours: campaignData.followUpHours,

            secondFollowUpDays: campaignData.secondFollowUpDays,

            secondFollowUpHours: campaignData.secondFollowUpHours,

            dailyLimit: campaignData.dailyLimit,

            weeklyLimit: campaignData.weeklyLimit,

            importLimit: campaignData.importLimit,

            startDate: startDateTime || today,

            endDate: endDateTime,

            startTime: campaignData.startTime,

            endTime: campaignData.endTime,

            hasEndDate: campaignData.hasEndDate,

            campaign_type,

            rows: mappedRows,
          }),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create campaign");
        }

        toast.success(data?.message || "Campaign created successfully!");
      }

      // Track successful campaign submission
      posthog.capture("campaign_submission_success", {
        campaign_name: campaignData.name,
        source_type: campaignData.sourceType,
        follow_up_enabled: campaignData.followUpEnabled,
        connection_message_enabled: campaignData.connectionMessageEnabled,
        daily_limit: campaignData.dailyLimit,
        import_limit: campaignData.importLimit,
        is_demo: isDemoMode,
        timestamp: new Date().toISOString(),
        component: "CampaignModal",
      });

      // Dispatch event to update import counter

      window.dispatchEvent(new Event("campaignCreated"));

      onSuccess({
        name: campaignData.name,

        sourceType: campaignData.sourceType,

        searchUrl: campaignData.searchUrl,

        connectionMessage: campaignData.connectionMessage,

        followUpMessage: campaignData.followUpMessage,

        secondFollowUpMessage: campaignData.secondFollowUpMessage,

        connectionMessageEnabled: campaignData.connectionMessageEnabled,

        followUpEnabled: campaignData.followUpEnabled,

        secondFollowUpEnabled: campaignData.secondFollowUpEnabled,

        followUpDays: campaignData.followUpDays,

        followUpHours: campaignData.followUpHours,

        secondFollowUpDays: campaignData.secondFollowUpDays,

        secondFollowUpHours: campaignData.secondFollowUpHours,

        dailyLimit: campaignData.dailyLimit,

        weeklyLimit: campaignData.weeklyLimit,

        importLimit: campaignData.importLimit,

        startDate: campaignData.startDate || today,

        endDate: campaignData.endDate,

        startTime: campaignData.startTime,

        endTime: campaignData.endTime,

        hasEndDate: campaignData.hasEndDate,
      });

      setErrors({});

      setCurrentStep(1);

      handleClose();
    } catch (error: any) {
      console.error("Error creating campaign:", error);

      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add CSV import step validation

  const isCsvImportValid = () => {
    if (campaignData.sourceType !== "csv" || !csvPreview) return true;

    const linkedInHeader = Object.entries(csvColumnMap).find(([, v]) => v === "linkedin_url")?.[0];

    if (!linkedInHeader) return false;

    const colIdx = csvHeaders.indexOf(linkedInHeader);

    if (colIdx === -1) return false;

    const invalidUrls = csvPreview
      .slice(1)
      .map((row) => row[colIdx])
      .filter((cell) => cell && !isValidLinkedInUrl(cell));

    return invalidUrls.length === 0;
  };

  // Add per-step validation

  const isStepValid = (() => {
    if (currentStep === 1) {
      // Source selection must be made
      if (!campaignData.sourceType) return false;

      if (campaignData.sourceType === "salesNavigator") {
        return salesNavStatus !== "unavailable";
      }

      return true;
    }

    if (currentStep === 2) {
      if (campaignData.sourceType === "csv") {
        // Must have importLimit, CSV file uploaded, and CSV file mapped
        return Boolean(campaignData.importLimit) && Boolean(csvPreview) && isCsvImportValid();
      }

      if (
        campaignData.sourceType === "searchUrl" ||
        campaignData.sourceType === "likes" ||
        campaignData.sourceType === "comments" ||
        campaignData.sourceType === "event" ||
        campaignData.sourceType === "salesNavigator"
      ) {
        // Must have a valid searchUrl and importLimit
        let hasValidUrl = false;
        if (campaignData.sourceType === "salesNavigator") {
          hasValidUrl =
            Boolean(campaignData.searchUrl) &&
            isValidUrl(campaignData.searchUrl) &&
            isValidSalesNavigatorUrl(campaignData.searchUrl);
        } else {
          hasValidUrl =
            Boolean(campaignData.searchUrl) &&
            isValidUrl(campaignData.searchUrl) &&
            campaignData.searchUrl.includes("linkedin.com");
        }
        return hasValidUrl && Boolean(campaignData.importLimit);
      }

      // For other types, just require importLimit
      return Boolean(campaignData.importLimit);
    }

    // For other steps, always valid
    return true;
  })();

  const insertVariableAtCursor = (
    ref: RefObject<HTMLTextAreaElement>,

    variable: string,

    field: "connectionMessage" | "followUpMessage" | "secondFollowUpMessage",
  ) => {
    if (!ref.current) return;

    const textarea = ref.current;

    const start = textarea.selectionStart;

    const end = textarea.selectionEnd;

    const value = textarea.value;

    const newValue = value.substring(0, start) + variable + value.substring(end);

    textarea.value = newValue;

    textarea.selectionStart = textarea.selectionEnd = start + variable.length;

    textarea.focus();

    setCampaignData((prev) => ({ ...prev, [field]: newValue }));
  };

  const todayEnCA = new Date().toLocaleDateString("en-CA");
  const getNowHHMM = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  // effective values (що фактично показуємо та використовуємо в Summary)
  const startDateEff = campaignData.startDate || todayEnCA;
  const startTimeEff = campaignData.startTime || getNowHHMM();
  const endDateEff = campaignData.endDate || ""; // показуємо тільки якщо hasEndDate
  const endTimeEff = campaignData.endTime || "17:00";

  // форматування для Summary (MM/DD/YYYY at H:MM AM/PM)
  const formatDateTime = (yyyyMmDd: string, hhmm: string) => {
    if (!yyyyMmDd) return "";
    const [year, month, day] = yyyyMmDd.split("-");
    const [h, m] = (hhmm || "00:00").split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${month}/${day}/${year} at ${displayHour}:${m} ${ampm}`;
  };

  // Only render modal if showModal is true
  if (!showModal && !isClosing) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out w-full h-full p-4 sm:p-6"
      style={{
        animation: showModal && !isClosing ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-in",
        opacity: isClosing ? 0 : 1,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[1200px] flex flex-col transform transition-all duration-300 ease-out rounded-3xl overflow-hidden"
        style={{
          animation: showModal && !isClosing ? "slideIn 0.4s ease-out" : "slideOut 0.3s ease-in",

          transform: isClosing
            ? "scale(0.95) translateY(20px)"
            : showModal
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with progress */}

        <div className="px-8 pt-6 pb-4 bg-white">
          <div className="flex flex-col items-center justify-center mb-4 relative">
            <button
              onClick={handleClose}
              className="absolute right-0 top-0 p-2 hover:bg-black/5 rounded-xl transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-black font-recoleta"></h2>
          </div>

          {/* Step Progress */}

          <div className="flex flex-col items-center mb-1">
            <div className="flex items-center gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  {step.number < currentStep ? (
                    <div className="w-4 h-4 rounded-full bg-[#0A66C2] border-[#0A66C2] flex items-center justify-center text-white text-[10px] transition-all duration-500 ease-out scale-110">
                      ✓
                    </div>
                  ) : step.number === currentStep ? (
                    <div className="w-4 h-4 rounded-full bg-[#0A66C2] border-[#0A66C2] transition-all duration-500 ease-out scale-110 animate-fill-circle" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white transition-all duration-300 hover:scale-105" />
                  )}

                  <span
                    className={cn(
                      "mt-2 text-xs  text-center transition-all duration-300",

                      currentStep === step.number
                        ? "text-[#0A66C2] font-semibold scale-105"
                        : "text-slate-500",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content area */}

        <div className="flex-1 overflow-hidden relative">
          <div className="px-8 py-4 bg-white h-full overflow-y-auto">
            {/* Warmup Warning */}
            {showWarmupWarning && (
              <div className="sticky bottom-0 -mx-8 px-8 py-4 bg-gradient-to-b from-white/0 via-white to-white">
                <div className="flex justify-center">
                  <Alert className="w-2/3 border border-black/10">
                    <AlertTitle className="text-zinc-800 font-medium">Just a heads up</AlertTitle>
                    <AlertDescription className="text-zinc-600">
                      Your account is currently in warmup mode for the first 2 weeks. During this
                      time, daily outreach volume is limited to keep your account safe. You'll
                      automatically unlock full sending once warmup is complete.
                    </AlertDescription>
                    <button
                      onClick={handleDismissWarning}
                      className="absolute right-2 top-2 p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </Alert>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                  {/* Source Selection */}
                  <div className="mb-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {sourceOptions.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              "group relative p-6 border border-slate-200 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center",

                              campaignData.sourceType === option.id
                                ? "border-[#0A66C2]/30 bg-[#0A66C2]/5"
                                : "border-slate-200 hover:border-slate-300",
                            )}
                            onClick={() => {
                              // Clear CSV data when changing source type
                              if (campaignData.sourceType === "csv") {
                                setCsvPreview(null);
                                setCsvAllData(null);
                                setCsvHeaders([]);
                                setCsvColumnMap({});
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }

                              setCampaignData((prev: CampaignData) => ({
                                ...prev,
                                sourceType: option.id as CampaignData["sourceType"],
                              }));
                            }}
                          >
                            {/* Icon without background - minimalist */}

                            <div
                              className={cn(
                                "w-12 h-12 flex items-center justify-center mb-3 transition-all duration-200",

                                campaignData.sourceType === option.id
                                  ? "text-[#0A66C2]"
                                  : "text-slate-600 group-hover:text-slate-800",
                              )}
                            >
                              <option.icon className="h-7 w-7" />
                            </div>

                            {/* Content */}

                            <div>
                              <h3
                                className={cn(
                                  " font-medium text-base mb-2 transition-colors",

                                  campaignData.sourceType === option.id
                                    ? "text-slate-900"
                                    : "text-slate-700 group-hover:text-slate-900",
                                )}
                              >
                                {option.title}
                              </h3>

                              <p
                                className={cn(
                                  "text-sm  leading-relaxed transition-colors",

                                  campaignData.sourceType === option.id
                                    ? "text-slate-700"
                                    : "text-slate-600 group-hover:text-slate-700",
                                )}
                              >
                                {option.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {errors.sourceType && (
                        <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-600 ">{errors.sourceType}</p>
                        </div>
                      )}

                      {/* Sales Navigator Status Messages */}
                      {campaignData.sourceType === "salesNavigator" && (
                        <div className="mt-4">
                          {salesNavStatus === "checking" && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <p className="text-sm text-blue-600 ">
                                Checking Sales Navigator access...
                              </p>
                            </div>
                          )}

                          {salesNavStatus === "unavailable" && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-red-600  font-medium">
                                  Sales Navigator access not detected
                                </p>
                                <p className="text-xs text-red-500  mt-1">
                                  Please ensure you have an active Sales Navigator subscription and
                                  try again.
                                </p>
                              </div>
                              <button
                                onClick={checkSalesNavigatorAccess}
                                disabled={isCheckingSalesNav}
                                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Try Again
                              </button>
                            </div>
                          )}

                          {salesNavStatus === "available" && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="h-4 w-4 text-green-500 flex-shrink-0">✅</div>
                              <p className="text-sm text-green-600 ">
                                Sales Navigator access confirmed
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {/* Steps to Import from CSV */}

                    {campaignData.sourceType === "csv" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Upload your CSV file
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Match your columns
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Review and confirm
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CSV File Upload Section */}

                    {campaignData.sourceType === "csv" && !csvPreview && (
                      <div className="mb-8">
                        <div className="space-y-4">
                          {/* Number of prospects to import input */}

                          <div className="flex items-center gap-4">
                            <Label className=" font-medium text-slate-700 text-sm whitespace-nowrap">
                              Number of prospects to import <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              type="number"
                              min={1}
                              max={10000}
                              className="w-32 px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-300 transition-colors text-sm"
                              value={campaignData.importLimit || ""}
                              onChange={(e) =>
                                setCampaignData((prev) => ({
                                  ...prev,
                                  importLimit: Number(e.target.value),
                                }))
                              }
                              disabled={isSubmitting}
                            />

                            {errors.importLimit && (
                              <span className="text-red-500 text-sm ml-2">
                                {errors.importLimit}
                              </span>
                            )}
                          </div>

                          {/* File selection section */}

                          <div className="flex items-center gap-4">
                            <Label className=" font-medium text-slate-700 text-sm whitespace-nowrap">
                              CSV File <span className="text-red-500">*</span>
                            </Label>

                            <input
                              type="file"
                              accept=".csv"
                              className="hidden"
                              id="csvFileInput"
                              ref={fileInputRef}
                              onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                  Papa.parse(file, {
                                    complete: (result: Papa.ParseResult<string[]>) => {
                                      const rawData = result.data as string[][];

                                      if (!rawData.length) return toast.error("CSV is empty.");

                                      const headers = rawData[0];

                                      // Filter out empty rows (rows where all cells are empty or whitespace)
                                      const isEmptyRow = (row: string[]): boolean => {
                                        return (
                                          !row ||
                                          row.length === 0 ||
                                          row.every((cell) => !cell || cell.trim().length === 0)
                                        );
                                      };

                                      // Keep header and filter out empty rows
                                      const filteredData = [
                                        headers, // Always keep header
                                        ...rawData.slice(1).filter((row) => !isEmptyRow(row)),
                                      ];

                                      if (filteredData.length <= 1) {
                                        return toast.error(
                                          "CSV contains no data rows (only empty rows).",
                                        );
                                      }

                                      setCsvHeaders(headers);

                                      setCsvAllData(filteredData); // Store filtered data for backend processing
                                      // Show preview rows: limit to importLimit if set, otherwise show first 25
                                      // But don't show more rows than actually exist in the file
                                      const actualRows = filteredData.length - 1; // Exclude header
                                      const importLimit = campaignData.importLimit;
                                      const maxPreviewRows = importLimit
                                        ? Math.min(importLimit, 25) // Show up to 25 or importLimit, whichever is smaller
                                        : 25; // Default to 25 if no limit set
                                      const previewRows = Math.min(
                                        maxPreviewRows + 1,
                                        filteredData.length,
                                      ); // +1 for header
                                      setCsvPreview(filteredData.slice(0, previewRows));

                                      setCsvColumnMap({});
                                    },

                                    error: () => toast.error("Failed to parse CSV."),
                                  });
                                }
                              }}
                              disabled={isSubmitting}
                            />

                            <label
                              htmlFor="csvFileInput"
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer font-medium text-sm"
                            >
                              Choose CSV File
                            </label>
                          </div>

                          <p className="text-sm text-slate-600 ">
                            Upload a CSV file containing LinkedIn profile URLs. The file should have
                            a "linkedin_url" column.
                          </p>

                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CSV Column Mapping Preview */}

                    {campaignData.sourceType === "csv" &&
                      csvPreview &&
                      (() => {
                        // Find which header is mapped to linkedin_url

                        const linkedInHeader = Object.entries(csvColumnMap).find(
                          ([, v]) => v === "linkedin_url",
                        )?.[0];

                        let invalidUrls: string[] = [];

                        if (linkedInHeader) {
                          const colIdx = csvHeaders.indexOf(linkedInHeader);

                          if (colIdx !== -1) {
                            invalidUrls = csvPreview
                              .slice(1)
                              .map((row) => row[colIdx])
                              .filter((cell) => cell && !isValidLinkedInUrl(cell));
                          }
                        }

                        // Helper function to format cell content
                        const formatCellContent = (content: string | undefined | null): string => {
                          if (!content) return "";
                          // Remove HTML tags and decode entities
                          const text = content
                            .replace(/<[^>]*>/g, " ") // Replace HTML tags with space
                            .replace(/&nbsp;/g, " ")
                            .replace(/&amp;/g, "&")
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'")
                            .trim();
                          return text;
                        };

                        // Helper function to truncate text
                        const truncateText = (text: string, maxLength: number = 100): string => {
                          if (text.length <= maxLength) return text;
                          return text.slice(0, maxLength) + "...";
                        };

                        const totalRowsInFile = csvAllData ? csvAllData.length - 1 : 0; // Exclude header row
                        const importLimit = campaignData.importLimit;
                        // The actual rows that will be imported (limited by importLimit)
                        const totalRowsToImport = importLimit
                          ? Math.min(totalRowsInFile, importLimit)
                          : totalRowsInFile;
                        const previewRowsCount = csvPreview ? csvPreview.length - 1 : 0; // Exclude header row
                        const remainingRows = totalRowsToImport - previewRowsCount;
                        const hasMoreRows = remainingRows > 0 && csvAllData && csvPreview;

                        return (
                          <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="text-sm font-medium text-slate-700 ">
                                Match your columns by selecting the appropriate option for each
                                header.
                              </div>
                              {csvAllData && (
                                <div className="text-xs text-slate-500 ">
                                  Showing {previewRowsCount} of {totalRowsToImport} rows
                                  {importLimit && totalRowsInFile > importLimit && (
                                    <span className="text-slate-400">
                                      {" "}
                                      (will import {importLimit} of {totalRowsInFile} total)
                                    </span>
                                  )}
                                  {!importLimit &&
                                    totalRowsInFile > previewRowsCount &&
                                    " (preview)"}
                                </div>
                              )}
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto max-h-[400px] overflow-y-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr>
                                    {csvHeaders.map((header, idx) => (
                                      <th
                                        key={header + idx}
                                        className="px-3 py-3 border-b border-slate-100 bg-slate-50 text-left min-w-[150px]"
                                      >
                                        <div className="flex flex-col gap-2">
                                          <span
                                            className="font-medium text-slate-900 text-xs truncate"
                                            title={header}
                                          >
                                            {header}
                                          </span>

                                          <Select
                                            value={csvColumnMap[header] || ""}
                                            onValueChange={(value) => {
                                              setCsvColumnMap((map) => ({
                                                ...map,
                                                [header]: value,
                                              }));
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Choose column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="fullName">Full Name</SelectItem>
                                              <SelectItem value="firstName">First Name</SelectItem>
                                              <SelectItem value="lastName">Last Name</SelectItem>
                                              <SelectItem value="company">Company</SelectItem>
                                              <SelectItem value="linkedin_url">
                                                LinkedIn Profile URL (required)
                                              </SelectItem>
                                              <SelectItem value="ignore">Ignore</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {csvPreview.slice(1).map((row, i) => (
                                    <tr key={i}>
                                      {row.map((cell, j) => {
                                        const formattedCell = formatCellContent(cell);
                                        const truncatedCell = truncateText(formattedCell, 100);
                                        const isTruncated = formattedCell.length > 100;

                                        return (
                                          <td
                                            key={j}
                                            className="px-3 py-2 border-b border-slate-100 text-slate-700 text-xs max-w-[200px]"
                                            title={isTruncated ? formattedCell : undefined}
                                          >
                                            <div className="truncate break-words">
                                              {truncatedCell}
                                            </div>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Validation message if linkedin_url not mapped */}

                            {!Object.values(csvColumnMap).includes("linkedin_url") && (
                              <div className="text-red-500 text-sm mt-2  flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Please tag one column as "LinkedIn Profile URL" to continue.
                              </div>
                            )}

                            {/* Validation for invalid LinkedIn URLs */}

                            {!!invalidUrls.length && (
                              <div className="text-red-500 text-sm mt-2  flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />

                                {`Some values in the selected column are not valid LinkedIn profile URLs.`}
                              </div>
                            )}

                            <div className="mt-4 flex gap-2 items-center justify-between">
                              <button
                                type="button"
                                className="text-slate-500 underline hover:text-slate-700 transition-colors text-sm font-medium bg-transparent border-none p-0 shadow-none outline-none cursor-pointer"
                                onClick={() => {
                                  setCsvPreview(null);
                                  setCsvAllData(null);

                                  setCsvHeaders([]);

                                  setCsvColumnMap({});

                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                              >
                                Upload another CSV
                              </button>

                              {hasMoreRows && csvAllData && (
                                <button
                                  type="button"
                                  className="text-[#0A66C2] hover:text-[#084d99] transition-colors text-sm font-medium bg-transparent border border-[#0A66C2] hover:border-[#084d99] rounded-lg px-4 py-2 cursor-pointer"
                                  onClick={() => {
                                    if (!csvAllData || !csvPreview) return;

                                    // Load next 25 rows (or remaining rows if less than 25)
                                    // But don't exceed importLimit if it's set
                                    const currentPreviewCount = csvPreview.length;
                                    const nextBatchSize = 25;
                                    const importLimit = campaignData.importLimit;
                                    const totalRowsInFile = csvAllData.length - 1; // Exclude header
                                    const maxRowsToShow = importLimit
                                      ? Math.min(importLimit + 1, csvAllData.length) // +1 for header
                                      : csvAllData.length;

                                    // Calculate how many more rows we can load
                                    const remainingRows = maxRowsToShow - currentPreviewCount;
                                    const rowsToLoad = Math.min(nextBatchSize, remainingRows);
                                    const nextEndIndex = currentPreviewCount + rowsToLoad;

                                    // Only update if there are actually more rows to show
                                    if (rowsToLoad > 0 && nextEndIndex <= maxRowsToShow) {
                                      setCsvPreview(csvAllData.slice(0, nextEndIndex));
                                    }
                                  }}
                                >
                                  Load more rows ({Math.min(25, remainingRows)} more)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                    {/* Steps to Import from LinkedIn Search */}

                    {campaignData.sourceType === "searchUrl" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <h4 className=" font-medium text-slate-700 text-sm mb-4">
                              How to import from LinkedIn search
                            </h4>

                            <div className="grid grid-cols-4 gap-2">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Search for people on LinkedIn
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Apply your filters
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Copy the search URL
                                </div>
                              </div>

                              {/* Step 4 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  4
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Paste it below
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 text-center">
                              <a
                                href="https://www.linkedin.com/search/results/people/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors"
                              >
                                Open LinkedIn Search
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Example Links - Only for Search URL */}

                    {campaignData.sourceType === "searchUrl" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="mb-3">
                          <h4 className=" font-medium text-slate-600 text-sm">
                            Example searches
                          </h4>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 ">
                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=Software%20Engineer&network=%5B%22S%22%5D&openTo=%5B%22JOB%22%5D&geo=%5B%22us%3A0%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              Software Engineer (Open to Work, 2nd-degree, US)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=VP%20of%20Engineering%20hiring&network=%5B%22S%22%5D&geo=%5B%22us%3A0%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              VP of Engineering (2nd-degree, hiring signal, US)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=Head%20of%20People&companySize=%5B%2211-50%22%2C%2251-200%22%5D&geo=%5B%22us%3A0%22%2C%22ca%3A0%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              Head of People (company size 11–200, US/Canada)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=Product%20Manager%20%28ex-Google%20OR%20ex-Meta%29&geo=%5B%22us%3A0%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              Product Manager (ex-Google or ex-Meta, US)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=Founder%20%28AI%20OR%20Fintech%29&companySize=%5B%221-10%22%2C%2211-50%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              Founder in AI or Fintech (&lt;50 employees)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          <a
                            href="https://www.linkedin.com/search/results/people/?keywords=CTO%20%22Series%20A%22&network=%5B%22S%22%5D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                              CTO (Series A, 2nd-degree)
                            </span>

                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Post Likes */}

                    {campaignData.sourceType === "likes" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Go to your LinkedIn feed
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Find the post with reactions
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Copy and paste the URL
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Post Comments */}

                    {campaignData.sourceType === "comments" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Go to your LinkedIn feed
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Find the post with comments
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Copy and paste the URL
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from Sales Navigator */}

                    {campaignData.sourceType === "salesNavigator" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <h4 className=" font-medium text-slate-700 text-sm mb-4">
                              How to import from Sales Navigator
                            </h4>

                            <div className="grid grid-cols-4 gap-2">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <p className="text-xs text-slate-600 ">
                                  Go to Sales Navigator
                                </p>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <p className="text-xs text-slate-600 ">
                                  Search for people
                                </p>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <p className="text-xs text-slate-600 ">Copy the URL</p>
                              </div>

                              {/* Step 4 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  4
                                </div>
                                <p className="text-xs text-slate-600 ">Paste below</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Event */}

                    {campaignData.sourceType === "event" && (
                      <div className="border border-slate-100 rounded-xl p-3 mt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Steps */}

                          <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Step 1 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  1
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Go to the LinkedIn event
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  2
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Copy the event URL
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="text-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium mb-2 mx-auto">
                                  3
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed">
                                  Copy and paste the URL
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Number of prospects to import */}

                    {!(campaignData.sourceType === "csv" && currentStep === 2) && (
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <Label
                            className=" font-medium text-slate-700 text-sm"
                            htmlFor="importLimitInput"
                          >
                            Number of prospects to import <span className="text-red-500">*</span>
                          </Label>

                          <Input
                            id="importLimitInput"
                            type="number"
                            min="1"
                            max={campaignData.importLimit}
                            placeholder="100"
                            className={cn(
                              "w-32 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                              errors.importLimit
                                ? "border-red-300 focus:border-red-400"
                                : "border-slate-200 focus:border-slate-300",
                            )}
                            value={campaignData.importLimit || ""}
                            onChange={(e) =>
                              setCampaignData((prev: CampaignData) => ({
                                ...prev,
                                importLimit: parseInt(e.target.value),
                              }))
                            }
                            disabled={isSubmitting}
                          />

                          {errors.importLimit && (
                            <span className="text-xs text-red-500 ml-2 flex items-center gap-1 ">
                              <AlertCircle className="h-4 w-4" />

                              {errors.importLimit}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Search URL */}

                    {campaignData.sourceType === "searchUrl" && (
                      <div className="mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label
                              className=" font-medium text-slate-700 text-sm whitespace-nowrap"
                              htmlFor="searchUrlInput"
                            >
                              LinkedIn Search URL <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/search/results/people/..."
                              className={cn(
                                "max-w-lg flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-400"
                                  : "border-slate-200 focus:border-slate-300",
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  searchUrl: newValue,
                                }));
                                // Real-time validation
                                const urlError = validateUrlInRealTime(newValue);
                                if (urlError) {
                                  setErrors((prev) => ({ ...prev, searchUrl: urlError }));
                                } else {
                                  setErrors((prev) => ({ ...prev, searchUrl: "" }));
                                }
                              }}
                              disabled={isSubmitting}
                            />
                          </div>

                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Post URL for Likes */}

                    {campaignData.sourceType === "likes" && (
                      <div className="mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label
                              className=" font-medium text-slate-700 text-sm whitespace-nowrap"
                              htmlFor="postUrlInput"
                            >
                              LinkedIn Post URL <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/posts/..."
                              className={cn(
                                "max-w-lg flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-400"
                                  : "border-slate-200 focus:border-slate-300",
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  searchUrl: newValue,
                                }));
                                // Real-time validation
                                const urlError = validateUrlInRealTime(newValue);
                                if (urlError) {
                                  setErrors((prev) => ({ ...prev, searchUrl: urlError }));
                                } else {
                                  setErrors((prev) => ({ ...prev, searchUrl: "" }));
                                }
                              }}
                              disabled={isSubmitting}
                            />
                          </div>

                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Post URL for Comments */}

                    {campaignData.sourceType === "comments" && (
                      <div className="mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label
                              className=" font-medium text-slate-700 text-sm whitespace-nowrap"
                              htmlFor="postUrlInputComments"
                            >
                              LinkedIn Post URL <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/posts/..."
                              className={cn(
                                "max-w-lg flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-400"
                                  : "border-slate-200 focus:border-slate-300",
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  searchUrl: newValue,
                                }));
                                // Real-time validation
                                const urlError = validateUrlInRealTime(newValue);
                                if (urlError) {
                                  setErrors((prev) => ({ ...prev, searchUrl: urlError }));
                                } else {
                                  setErrors((prev) => ({ ...prev, searchUrl: "" }));
                                }
                              }}
                              disabled={isSubmitting}
                            />
                          </div>

                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sales Navigator URL */}

                    {campaignData.sourceType === "salesNavigator" && (
                      <div className="mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label
                              className=" font-medium text-slate-700 text-sm whitespace-nowrap"
                              htmlFor="searchUrlInput"
                            >
                              Sales Navigator URL <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/sales/search/people?..."
                              className={cn(
                                "max-w-lg flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-400"
                                  : "border-slate-200 focus:border-slate-300",
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  searchUrl: newValue,
                                }));
                                // Real-time validation
                                const urlError = validateUrlInRealTime(newValue);
                                if (urlError) {
                                  setErrors((prev) => ({ ...prev, searchUrl: urlError }));
                                } else {
                                  setErrors((prev) => ({ ...prev, searchUrl: "" }));
                                }
                              }}
                            />
                          </div>

                          {errors.searchUrl && (
                            <p className="text-red-500 text-xs ">{errors.searchUrl}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Event URL for Event */}

                    {campaignData.sourceType === "event" && (
                      <div className="mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label
                              className=" font-medium text-slate-700 text-sm whitespace-nowrap"
                              htmlFor="eventUrlInput"
                            >
                              LinkedIn Event URL <span className="text-red-500">*</span>
                            </Label>

                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/events/..."
                              className={cn(
                                "max-w-lg flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-colors text-sm",

                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-400"
                                  : "border-slate-200 focus:border-slate-300",
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  searchUrl: newValue,
                                }));
                                // Real-time validation
                                const urlError = validateUrlInRealTime(newValue);
                                if (urlError) {
                                  setErrors((prev) => ({ ...prev, searchUrl: urlError }));
                                } else {
                                  setErrors((prev) => ({ ...prev, searchUrl: "" }));
                                }
                              }}
                              disabled={isSubmitting}
                            />
                          </div>

                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CSV File Upload Section */}

                    {campaignData.sourceType === "csv" && (
                      <div className="mb-8">
                        <div className="space-y-4">
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />

                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3 pb-2">
                <div className="max-w-7xl mx-auto px-4 relative">
                  {/* Personalization Notes - Compact, at top */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mb-2 min-h-0 max-h-[calc(100vh-200px)]">
                    {/* Connection Message Card */}

                    <div
                      className={cn(
                        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col w-full w-full min-h-[240px] max-h-[300px] flex-shrink-0",

                        !campaignData.connectionMessageEnabled && "opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 text-base">
                          Connection Message
                        </span>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer shadow-sm",

                              campaignData.connectionMessageEnabled
                                ? "bg-[#0A66C2] shadow-[#0A66C2]/25"
                                : "bg-slate-200 hover:bg-slate-300",
                            )}
                            onClick={() =>
                              setCampaignData((prev: CampaignData) => ({
                                ...prev,
                                connectionMessageEnabled: !prev.connectionMessageEnabled,
                              }))
                            }
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",

                                campaignData.connectionMessageEnabled
                                  ? "translate-x-3"
                                  : "translate-x-0",
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-2">
                        Optional note sent with your invitation.
                      </p>

                      <div className="flex justify-end mb-2">
                        {/* Removed Variables dropdown/button above connection message textarea */}
                      </div>

                      <Textarea
                        ref={connectionMessageRef}
                        className={cn(
                          "w-full border border-slate-200 rounded-lg p-3 h-[140px] text-base focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white placeholder:text-slate-400 resize-none",

                          errors.connectionMessage
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-200",

                          !campaignData.connectionMessageEnabled && "opacity-50 cursor-not-allowed",
                        )}
                        placeholder="Hi {{firstName}}, I came across your profile and thought it would be great to connect!"
                        rows={6}
                        disabled={!campaignData.connectionMessageEnabled || isSubmitting}
                        value={campaignData.connectionMessage}
                        onChange={(e) =>
                          setCampaignData((prev: CampaignData) => ({
                            ...prev,
                            connectionMessage: e.target.value,
                          }))
                        }
                      />

                      {errors.connectionMessage && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />

                          {errors.connectionMessage}
                        </p>
                      )}

                      <div className="bg-slate-50 rounded-md px-2.5 py-1.5 mt-2 w-fit text-xs flex items-center border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="flex items-center justify-center font-medium text-slate-600 text-xs focus:outline-none bg-transparent hover:text-slate-800 transition-colors duration-200"
                              title="Insert variable"
                            >
                              Variables
                              <svg
                                className="ml-1 h-3 w-3 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  connectionMessageRef,
                                  "{{firstName}}",
                                  "connectionMessage",
                                )
                              }
                            >
                              First Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  connectionMessageRef,
                                  "{{lastName}}",
                                  "connectionMessage",
                                )
                              }
                            >
                              Last Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  connectionMessageRef,
                                  "{{company}}",
                                  "connectionMessage",
                                )
                              }
                            >
                              Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* First Follow-up Message Card */}

                    <div
                      className={cn(
                        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col w-full w-full min-h-[240px] max-h-[300px] flex-shrink-0",

                        !campaignData.followUpEnabled && "opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 text-base">
                          First Follow-up
                        </span>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer shadow-sm",

                              campaignData.followUpEnabled
                                ? "bg-[#0A66C2] shadow-[#0A66C2]/25"
                                : "bg-slate-200 hover:bg-slate-300",
                            )}
                            onClick={() =>
                              setCampaignData((prev: CampaignData) => ({
                                ...prev,
                                followUpEnabled: !prev.followUpEnabled,
                              }))
                            }
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",

                                campaignData.followUpEnabled ? "translate-x-3" : "translate-x-0",
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-slate-500 mr-1" />

                        <input
                          type="number"
                          min={0}
                          max={14}
                          value={campaignData.followUpDays}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              followUpDays: parseInt(e.target.value),
                            }))
                          }
                          disabled={!campaignData.followUpEnabled || isSubmitting}
                          className="w-12 px-2 py-1 text-center text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200"
                          style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />

                        <span className="text-xs text-slate-700 mx-1">days</span>

                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={campaignData.followUpHours}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              followUpHours: parseInt(e.target.value),
                            }))
                          }
                          disabled={!campaignData.followUpEnabled || isSubmitting}
                          className="w-12 px-2 py-1 text-center text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200"
                          style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />

                        <span className="text-xs text-slate-700 mx-1">hours</span>

                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {" "}
                          after connecting.
                        </span>
                      </div>

                      {/* Removed Variables dropdown above follow-up message textarea */}

                      <Textarea
                        ref={followUpMessageRef}
                        className={cn(
                          "w-full border border-slate-200 rounded-lg p-3 h-[140px] text-base focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white placeholder:text-slate-400 resize-none",

                          !campaignData.followUpEnabled && "opacity-50 cursor-not-allowed",

                          errors.followUpMessage
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-200",
                        )}
                        placeholder="Hi {{firstName}}, just wanted to follow up in case you missed my last message. Always happy to connect with fellow professionals!"
                        rows={6}
                        disabled={!campaignData.followUpEnabled || isSubmitting}
                        value={campaignData.followUpMessage}
                        onChange={(e) =>
                          setCampaignData((prev: CampaignData) => ({
                            ...prev,
                            followUpMessage: e.target.value,
                          }))
                        }
                      />

                      {errors.followUpMessage && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />

                          {errors.followUpMessage}
                        </p>
                      )}

                      <div className="bg-slate-50 rounded-md px-2.5 py-1.5 mt-2 w-fit text-xs flex items-center border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="flex items-center justify-center font-medium text-slate-600 text-xs focus:outline-none bg-transparent hover:text-slate-800 transition-colors duration-200"
                              title="Insert variable"
                            >
                              Variables
                              <svg
                                className="ml-1 h-3 w-3 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  followUpMessageRef,
                                  "{{firstName}}",
                                  "followUpMessage",
                                )
                              }
                            >
                              First Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  followUpMessageRef,
                                  "{{lastName}}",
                                  "followUpMessage",
                                )
                              }
                            >
                              Last Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  followUpMessageRef,
                                  "{{company}}",
                                  "followUpMessage",
                                )
                              }
                            >
                              Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Second Follow-up Message Card */}

                    <div
                      className={cn(
                        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col w-full w-full min-h-[240px] max-h-[300px] flex-shrink-0",

                        !campaignData.secondFollowUpEnabled && "opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 text-base">
                          Second Follow-up
                        </span>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-5 rounded-full p-0.5 transition-all duration-200 cursor-pointer shadow-sm",

                              campaignData.secondFollowUpEnabled
                                ? "bg-[#0A66C2] shadow-[#0A66C2]/25"
                                : "bg-slate-200 hover:bg-slate-300",
                            )}
                            onClick={() => {
                              setCampaignData((prev: CampaignData) => ({
                                ...prev,

                                secondFollowUpEnabled: !prev.secondFollowUpEnabled,
                              }));
                            }}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",

                                campaignData.secondFollowUpEnabled
                                  ? "translate-x-3"
                                  : "translate-x-0",
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-slate-500 mr-1" />

                        <input
                          type="number"
                          min={0}
                          max={28}
                          value={campaignData.secondFollowUpDays}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              secondFollowUpDays: parseInt(e.target.value),
                            }))
                          }
                          disabled={!campaignData.secondFollowUpEnabled || isSubmitting}
                          className="w-12 px-2 py-1 text-center text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200"
                          style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />

                        <span className="text-xs text-slate-700 mx-1">days</span>

                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={campaignData.secondFollowUpHours}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              secondFollowUpHours: parseInt(e.target.value),
                            }))
                          }
                          disabled={!campaignData.secondFollowUpEnabled || isSubmitting}
                          className="w-12 px-2 py-1 text-center text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200"
                          style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />

                        <span className="text-xs text-slate-700 mx-1">hours</span>

                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {" "}
                          after first follow up.
                        </span>
                      </div>

                      <div className="flex justify-end mb-2">
                        {/* Removed Variables dropdown/button above connection message textarea */}
                      </div>

                      <Textarea
                        ref={secondFollowUpMessageRef}
                        className={cn(
                          "w-full border border-slate-200 rounded-lg p-3 h-[140px] text-base focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white placeholder:text-slate-400 resize-none",

                          !(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled) &&
                            "opacity-50 cursor-not-allowed",

                          errors.secondFollowUpMessage
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-200",
                        )}
                        placeholder="Hi {{firstName}}, reaching out one last time. If now isn't the right time, no worries at all—wishing you all the best!"
                        rows={6}
                        disabled={!campaignData.secondFollowUpEnabled || isSubmitting}
                        value={campaignData.secondFollowUpMessage}
                        onChange={(e) =>
                          setCampaignData((prev: CampaignData) => ({
                            ...prev,
                            secondFollowUpMessage: e.target.value,
                          }))
                        }
                      />

                      {errors.secondFollowUpMessage && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />

                          {errors.secondFollowUpMessage}
                        </p>
                      )}

                      <div className="bg-slate-50 rounded-md px-2.5 py-1.5 mt-2 w-fit text-xs flex items-center border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="flex items-center justify-center font-medium text-slate-600 text-xs focus:outline-none bg-transparent hover:text-slate-800 transition-colors duration-200"
                              title="Insert variable"
                            >
                              Variables
                              <svg
                                className="ml-1 h-3 w-3 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  secondFollowUpMessageRef,
                                  "{{firstName}}",
                                  "secondFollowUpMessage",
                                )
                              }
                            >
                              First Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  secondFollowUpMessageRef,
                                  "{{lastName}}",
                                  "secondFollowUpMessage",
                                )
                              }
                            >
                              Last Name
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                insertVariableAtCursor(
                                  secondFollowUpMessageRef,
                                  "{{company}}",
                                  "secondFollowUpMessage",
                                )
                              }
                            >
                              Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 pb-4">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-3">
                    {/* Campaign Name */}

                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex-shrink-0">
                          <Label className=" font-semibold text-slate-900 text-lg">
                            Name
                          </Label>

                          <p className="text-sm text-slate-500  mt-1">
                            Give your campaign a memorable name
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <Input
                            placeholder="e.g., Sales Outreach Q3"
                            className={cn(
                              "w-80 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white placeholder:text-slate-400 text-base ",

                              errors.name
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-slate-200",
                            )}
                            value={campaignData.name}
                            onChange={(e) =>
                              setCampaignData((prev: CampaignData) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            disabled={isSubmitting}
                          />

                          {errors.name && (
                            <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <p className="text-sm text-red-600 ">{errors.name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campaign Schedule */}

                    <div className="mb-8">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <Label className=" font-semibold text-slate-900 text-lg">
                            Schedule
                          </Label>

                          <p className="text-sm text-slate-500  mt-1">
                            Set when your campaign should start and optionally when it should end
                          </p>
                        </div>

                        <div className="flex-shrink-0 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-slate-700">Start:</Label>

                            <div className="flex gap-2">
                              <Input
                                type="date"
                                className="w-36 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white"
                                value={startDateEff}
                                min={todayEnCA}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({
                                    ...prev,
                                    startDate: e.target.value,
                                  }))
                                }
                                disabled={isSubmitting}
                              />

                              <Input
                                type="time"
                                className="w-24 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white"
                                value={startTimeEff}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({
                                    ...prev,
                                    startTime: e.target.value,
                                  }))
                                }
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-slate-700 w-10">End:</Label>

                            <div
                              className={cn(
                                "w-10 h-6 rounded-full p-1 transition-colors cursor-pointer",

                                campaignData.hasEndDate ? "bg-[#0A66C2]" : "bg-slate-200",
                              )}
                              onClick={() =>
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  hasEndDate: !prev.hasEndDate,
                                }))
                              }
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full bg-white transition-transform",

                                  campaignData.hasEndDate ? "translate-x-4" : "translate-x-0",
                                )}
                              />
                            </div>

                            {campaignData.hasEndDate ? (
                              <div className="flex gap-2">
                                <Input
                                  type="date"
                                  className="w-36 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white"
                                  value={endDateEff}
                                  min={campaignData.startDate || todayEnCA}
                                  onChange={(e) =>
                                    setCampaignData((prev) => ({
                                      ...prev,
                                      endDate: e.target.value,
                                    }))
                                  }
                                  disabled={isSubmitting}
                                />

                                <Input
                                  type="time"
                                  className="w-24 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all duration-200 bg-white"
                                  value={endTimeEff}
                                  onChange={(e) =>
                                    setCampaignData((prev) => ({
                                      ...prev,
                                      endTime: e.target.value,
                                    }))
                                  }
                                  disabled={isSubmitting}
                                />
                              </div>
                            ) : (
                              <span className="text-sm text-slate-400">No end date</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Summary */}

                    <div className="mb-3">
                      <h4 className=" font-semibold text-slate-900 text-lg mb-2">
                        Summary
                      </h4>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">Source</span>

                          <span className="text-black font-medium text-sm">
                            {campaignData.sourceType === "searchUrl"
                              ? "LinkedIn Search"
                              : campaignData.sourceType === "csv"
                                ? "CSV Upload"
                                : campaignData.sourceType === "likes"
                                  ? "Likes"
                                  : campaignData.sourceType === "comments"
                                    ? "Comments"
                                    : campaignData.sourceType === "event"
                                      ? "Event"
                                      : campaignData.sourceType === "salesNavigator"
                                        ? "Sales Navigator"
                                        : "Unknown"}
                          </span>
                        </div>

                        <div className="flex justify-between items-start py-2 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">
                            {campaignData.sourceType === "likes" ||
                            campaignData.sourceType === "comments"
                              ? "Post URL"
                              : campaignData.sourceType === "salesNavigator"
                                ? "Sales Navigator URL"
                                : "Keywords"}
                          </span>

                          <div className="flex flex-col items-end gap-1 max-w-[250px]">
                            {(() => {
                              try {
                                if (
                                  campaignData.sourceType === "likes" ||
                                  campaignData.sourceType === "comments"
                                ) {
                                  // For likes/comments, show the LinkedIn post URL in a compact format

                                  if (!campaignData.searchUrl)
                                    return <span className="text-slate-400 text-sm">Not set</span>;

                                  const url = campaignData.searchUrl;

                                  const displayText = formatUrlForDisplay(url, 40);

                                  return (
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-[#0A66C2] text-sm hover:underline flex-1"
                                        title={url}
                                      >
                                        {displayText}
                                      </a>

                                      <button
                                        type="button"
                                        className="ml-1 text-slate-400 hover:text-[#0A66C2] focus:outline-none"
                                        onClick={() => {
                                          navigator.clipboard.writeText(url);
                                        }}
                                        title="Copy URL"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </button>

                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-1 text-slate-400 hover:text-[#0A66C2]"
                                        title="Open in new tab"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />

                                          <polyline points="15 3 21 3 21 9" />

                                          <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                      </a>
                                    </div>
                                  );
                                } else if (
                                  campaignData.searchUrl &&
                                  campaignData.searchUrl.includes("keywords=")
                                ) {
                                  // For search URLs, extract and show keywords

                                  const parts = campaignData.searchUrl.split("keywords=");

                                  if (parts[1]) {
                                    const keywordParam = parts[1].split("&")[0] || "Not set";

                                    const decoded = decodeURIComponent(
                                      keywordParam.replace(/\+/g, " "),
                                    );

                                    return (
                                      <span className="text-black font-medium text-sm">
                                        {decoded || "Not set"}
                                      </span>
                                    );
                                  }
                                }

                                return <span className="text-slate-400 text-sm">Not set</span>;
                              } catch (e) {
                                console.error("Error parsing searchUrl", e);

                                return <span className="text-slate-400 text-sm">Not set</span>;
                              }
                            })()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">Prospects to import</span>

                          <span className="text-black font-semibold text-sm">
                            {campaignData.importLimit}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">Connection message</span>

                          <span className="text-black font-medium text-sm">
                            {campaignData.connectionMessageEnabled
                              ? campaignData.connectionMessage
                                ? "Set"
                                : "Not set"
                              : "Disabled"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">First follow-up</span>

                          <span className="text-black font-medium text-sm">
                            {campaignData.followUpEnabled
                              ? `${campaignData.followUpMessage ? "Set" : "Not set"} (${campaignData.followUpDays} days)`
                              : "Disabled"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-sm">Second follow-up</span>

                          <span className="text-black font-medium text-sm">
                            {campaignData.secondFollowUpEnabled && campaignData.followUpEnabled
                              ? `${campaignData.secondFollowUpMessage ? "Set" : "Not set"} (${campaignData.secondFollowUpDays} days)`
                              : "Disabled"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600 text-sm">Campaign schedule</span>

                          <span className="text-black font-medium text-sm">
                            {formatDateTime(startDateEff, startTimeEff)}
                            {campaignData.hasEndDate && endDateEff
                              ? ` to ${formatDateTime(endDateEff, endTimeEff)}`
                              : " - ongoing"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step Navigation - Fixed at bottom */}
        <div className="px-8 py-6 bg-white">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
              className={cn(
                "px-4 py-2 rounded-xl border font-medium transition-all  flex items-center gap-2 text-sm border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50",

                isFirstStep || isSubmitting
                  ? "border-slate-200 text-slate-400 cursor-not-allowed"
                  : "",
              )}
              disabled={isFirstStep || isSubmitting}
            >
              ← Back
            </button>

            <button
              onClick={handleSubmit}
              className={cn(
                "px-4 py-2 rounded-xl border-none font-medium transition-all  flex items-center gap-2 shadow-md text-sm",

                isSubmitting || !isStepValid || isCheckingSalesNav
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#0A66C2] hover:bg-[#084d99] text-white cursor-pointer",
              )}
              disabled={isSubmitting || !isStepValid || isCheckingSalesNav}
            >
              {isLastStep
                ? isSubmitting
                  ? "Creating Campaign..."
                  : "Create Campaign →"
                : isCheckingSalesNav
                  ? "Checking Sales Navigator..."
                  : campaignData.sourceType === "salesNavigator" && salesNavStatus === "unavailable"
                    ? "Sales Navigator Not Available"
                    : "Next Step →"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
