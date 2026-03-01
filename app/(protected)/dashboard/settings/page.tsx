"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Pencil,
  User2Icon,
  MailIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Shield,
  Plus,
  AlertCircle,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { signOutUser } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Slider } from "@/components/ui/slider";
import { useWarmupStatus } from "@/components/hooks/useWarmupStatus";
import { Suspense } from "react";

interface EditableField {
  id: "first_name" | "last_name";
  label: string;
  value: string;
}

type TabType = "profile" | "support" | "logout" | "guardrails";

function SettingsContent() {
  const user = useUser();
  const { isInWarmup, daysRemaining, isLoading: warmupLoading } = useWarmupStatus();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  useEffect(() => {
    if (tabParam && ["profile", "support", "logout", "guardrails"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [updatedValues, setUpdatedValues] = useState<Record<string, string>>({});
  const [newBlockedUrl, setNewBlockedUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  const [isLoadingBlocked, setIsLoadingBlocked] = useState(false);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  // Add null check before destructuring
  const userMetadata = user.user?.user_metadata || {};
  const { first_name = "", last_name = "" } = userMetadata as any;
  const email = user.user?.email || "";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch settings");

        const { settings } = await res.json();
        if (settings) {
          const connLimitValue = settings.max_connections_per_day ?? 20;
          const msgLimitValue = settings.max_message_per_day ?? 50;
          const visitsLimitValue = settings.total_visits_per_day ?? 50;

          setConnLimit(connLimitValue);
          setMsgLimit(msgLimitValue);
          setVisitsLimit(visitsLimitValue);

          // Синхронізуємо слайдери з даними з БД
          setConnReq(connLimitValue);
          setProfileVisits(visitsLimitValue);
          setMessages(msgLimitValue);
        }
      } catch (err) {
        console.error("Failed to load LinkedIn settings:", err);
      }
    };

    fetchSettings();
  }, []);

  // Load blocked URLs from API
  useEffect(() => {
    const fetchBlockedUrls = async () => {
      try {
        setIsLoadingUrls(true);
        const response = await fetch("/api/settings/blocked-profiles");
        if (response.ok) {
          const data = await response.json();
          setBlockedUrls(data.blockedUrls || []);
        } else {
          console.error("Failed to fetch blocked URLs");
        }
      } catch (error) {
        console.error("Error fetching blocked URLs:", error);
      } finally {
        setIsLoadingUrls(false);
      }
    };

    fetchBlockedUrls();
  }, []);

  const validateLinkedInUrl = (url: string) => {
    const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const handleAddBlockedUrl = async () => {
    if (!newBlockedUrl) {
      setUrlError("Please enter a LinkedIn profile URL");
      return;
    }

    if (!validateLinkedInUrl(newBlockedUrl)) {
      setUrlError(
        "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
      );
      return;
    }

    try {
      setIsLoadingBlocked(true);
      setUrlError("");

      const response = await fetch("/api/settings/blocked-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileUrl: newBlockedUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedUrls((prev) => [...prev, data.blockedProfile.profile_url]);
        setNewBlockedUrl("");
      } else {
        const errorData = await response.json();
        setUrlError(errorData.error || "Failed to add blocked URL");
      }
    } catch (error) {
      console.error("Error adding blocked URL:", error);
      setUrlError("Failed to add blocked URL. Please try again.");
    } finally {
      setIsLoadingBlocked(false);
    }
  };

  const handleRemoveBlockedUrl = async (urlToRemove: string) => {
    try {
      setIsLoadingBlocked(true);

      const response = await fetch(
        `/api/settings/blocked-profiles?profileUrl=${encodeURIComponent(urlToRemove)}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setBlockedUrls((prev) => prev.filter((url) => url !== urlToRemove));
      } else {
        console.error("Failed to remove blocked URL");
      }
    } catch (error) {
      console.error("Error removing blocked URL:", error);
    } finally {
      setIsLoadingBlocked(false);
    }
  };

  const fields: EditableField[] = [
    { id: "first_name", label: "First Name", value: first_name },
    { id: "last_name", label: "Last Name", value: last_name },
  ];

  const handleEdit = (fieldId: string) => {
    setEditingFields((prev) => {
      const newSet = new Set(prev);
      newSet.add(fieldId);
      return newSet;
    });

    // Focus the input after the state update
    setTimeout(() => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 0);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = async () => {
    if (Object.keys(updatedValues).length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("Settings updated successfully");
      setEditingFields(new Set());
      setUpdatedValues(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOutUser();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = Object.keys(updatedValues).length > 0;

  const renderMainContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl  text-gray-900 mb-6 tracking-tight">
              Profile Information
            </h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Email (read-only) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium ">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="border  bg-gray-100 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
              {/* Editable fields */}
              {fields.map((field) => {
                const isEditing = editingFields.has(field.id);
                const currentValue = updatedValues[field.id] ?? field.value;

                return (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-medium ">
                      {field.label}
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={field.id}
                        type="text"
                        value={currentValue}
                        className="border focus:border-black transition-colors "
                        disabled={!isEditing || isLoading}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                      <button
                        className="h-8 w-8 hover:bg-yellow-400/10 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => handleEdit(field.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {hasChanges && (
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSave}
                    className="w-full px-6 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === "guardrails") {
      return (
        <div className="w-full space-y-6">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl  text-gray-900 mb-6 tracking-tight">
              LinkedIn Daily Action Limits
            </h2>

            {/* Warmup Warning */}
            {isInWarmup && !warmupLoading && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900  mb-1">
                      Warmup Period Active
                    </h3>
                    <p className="text-sm text-gray-600 ">
                      Your account is currently in warmup mode for the first{" "}
                      {daysRemaining > 0
                        ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`
                        : "period"}
                      . During this time, daily outreach volume is automatically limited to keep
                      your account safe. These settings will become active once warmup is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className={`space-y-6 ${isInWarmup ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ">
                    Connection requests
                  </label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Conservative</span>
                    <Slider
                      min={0}
                      max={200}
                      step={1}
                      value={[connReq]}
                      onValueChange={([v]) => setConnReq(v)}
                      className="w-full"
                      trackClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                    <span className="text-xs text-indigo-600 font-bold ml-2">Ambitious</span>
                    <span className="text-sm text-gray-500 ">{connReq}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ">
                    Profile visits
                  </label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Conservative</span>
                    <Slider
                      min={0}
                      max={350}
                      step={1}
                      value={[profileVisits]}
                      onValueChange={([v]) => setProfileVisits(v)}
                      className="w-full"
                      trackClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                    <span className="text-xs text-indigo-600 font-bold ml-2">Ambitious</span>
                    <span className="text-sm text-gray-500 ">{profileVisits}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ">Messages</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Conservative</span>
                    <Slider
                      min={0}
                      max={300}
                      step={1}
                      value={[messages]}
                      onValueChange={([v]) => setMessages(v)}
                      className="w-full"
                      trackClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                    <span className="text-xs text-indigo-600 font-bold ml-2">Ambitious</span>
                    <span className="text-sm text-gray-500 ">{messages}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ">InMails</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Conservative</span>
                    <Slider
                      min={0}
                      max={70}
                      step={1}
                      value={[inmails]}
                      onValueChange={([v]) => setInmails(v)}
                      className="w-full"
                      trackClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
                    />
                    <span className="text-xs text-indigo-600 font-bold ml-2">Ambitious</span>
                    <span className="text-sm text-gray-500 ">{inmails}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600  mt-4 mb-2">
                If you're not sure what to do, select from one of the preset profiles below.
              </p>
              <div className="flex flex-row gap-4 mb-6">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 px-4 py-2 text-left transition-colors"
                    onClick={() => {
                      setConnReq(preset.values.connReq);
                      setProfileVisits(preset.values.profileVisits);
                      setMessages(preset.values.messages);
                      setInmails(preset.values.inmails);
                    }}
                  >
                    <div className="font-medium text-sm mb-1">{preset.label}</div>
                    <div className="text-xs text-gray-500 leading-snug">{preset.description}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleUpdateLimits}
                disabled={isLoading || isInWarmup}
                className="px-6 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm disabled:opacity-50"
              >
                {isInWarmup ? "Settings locked during warmup" : "Update Limits"}
              </button>
            </div>
          </div>

          {/* Blocked Users */}
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl  text-gray-900 mb-6 tracking-tight">
              Blocked LinkedIn Profiles
            </h2>

            <div className="space-y-6">
              <div>
                <p className=" text-sm text-gray-500">
                  Add LinkedIn profile URLs that you want to exclude from automation. These users
                  will be skipped during connection requests and messaging.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    value={newBlockedUrl}
                    onChange={(e) => {
                      setNewBlockedUrl(e.target.value);
                      setUrlError("");
                    }}
                    className="flex-1 border focus:border-black "
                  />
                  <button
                    onClick={handleAddBlockedUrl}
                    disabled={isLoadingBlocked}
                    className="px-4 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {isLoadingBlocked ? "Adding..." : "Add URL"}
                  </button>
                </div>

                {urlError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 ">
                    <AlertCircle className="h-4 w-4" />
                    {urlError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {isLoadingUrls ? (
                  <div className="text-center py-8 border border-dashed border-black/10 rounded-xl">
                    <p className="text-sm text-gray-500 ">Loading blocked URLs...</p>
                  </div>
                ) : (
                  <>
                    {blockedUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white"
                      >
                        <span className="text-sm font-medium text-gray-700 truncate flex-1 ">
                          {url}
                        </span>
                        <button
                          onClick={() => handleRemoveBlockedUrl(url)}
                          disabled={isLoadingBlocked}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove URL"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}

                    {blockedUrls.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-black/10 rounded-xl">
                        <p className="text-sm text-gray-500 ">
                          No blocked users added yet
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "support") {
      const userMetadata = user.user?.user_metadata || {};
      const partnerCode = userMetadata.partner_code;

      let supportEmail = "adhiraj@kingstonesystems.com";
      if (partnerCode === "Wyneo2026") supportEmail = "dan@wyneotech.com";
      else if (partnerCode === "PenPaper2026") supportEmail = "ceo@pentopaper.xyz";
      else if (partnerCode === "LaunchLens2026") supportEmail = "info@launchlens.xyz";

      return (
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl  text-gray-900 mb-4 tracking-tight">Need Help?</h2>
            <p className="text-gray-600 ">
              If you have any questions, concerns, or need assistance, please don't hesitate to
              reach out to our support team at:{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {supportEmail}
              </a>
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === "logout") {
      return (
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl  text-gray-900 mb-4 tracking-tight">Logout</h2>
            <p className="text-gray-600  mb-6">
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </p>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-6 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm disabled:opacity-50"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      );
    }


    return (
      <div className="w-full">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.map((field) => {
            const isEditing = editingFields.has(field.id);
            const currentValue = updatedValues[field.id] ?? field.value;

            return (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-sm font-medium ">
                  {field.label}
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    id={field.id}
                    type="text"
                    value={currentValue}
                    className="pr-10 "
                    disabled={!isEditing || isLoading}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                  <button
                    className="h-6 w-6 hover:bg-yellow-400/10 rounded flex items-center justify-center transition-colors disabled:opacity-50"
                    disabled={isLoading}
                    onClick={() => handleEdit(field.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {hasChanges && (
            <div className="pt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSave}
                className="w-full  font-bold"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    );
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const [connLimit, setConnLimit] = useState<number>(20);
  const [msgLimit, setMsgLimit] = useState<number>(50);
  const [visitsLimit, setVisitsLimit] = useState<number>(50);

  // Add state for each slider if not already present
  const [connReq, setConnReq] = useState(20);
  const [profileVisits, setProfileVisits] = useState(50);
  const [messages, setMessages] = useState(50);
  const [inmails, setInmails] = useState(5);

  // Add these preset values
  const PRESETS = [
    {
      label: 'For free, recent or "cold" accounts',
      description:
        'Best if you have a free LinkedIn account or a Premium account that\'s "cold" (rarely active, fewer than 2,000 connections)',
      values: { connReq: 10, profileVisits: 50, messages: 40, inmails: 20 },
    },
    {
      label: "Slow premium account",
      description:
        'If you have a "warm" account (>2,000 connections) and use Sales Navigator, Recruiter or Premium',
      values: { connReq: 20, profileVisits: 150, messages: 100, inmails: 30 },
    },
    {
      label: "Fast premium account",
      description:
        "If you have a warm premium account and want to go as fast as possible while remaining safe",
      values: { connReq: 40, profileVisits: 240, messages: 120, inmails: 30 },
    },
  ];

  const handleUpdateLimits = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_connections_per_day: connReq,
          max_message_per_day: messages,
          total_visits_per_day: profileVisits,
          max_inmails_per_day: inmails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // Оновлюємо локальні стани після успішного збереження
      setConnLimit(connReq);
      setMsgLimit(messages);
      setVisitsLimit(profileVisits);

      setSuccess("Limits updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-500/50 rounded-xl text-red-800 ">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-500/50 rounded-xl text-green-800 ">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white p-6 rounded-xl border border-black/10">
        <div className="flex space-x-1" ref={emblaRef}>
          <div className="flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "profile"
                  ? "font-bold text-black"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <User2Icon className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("guardrails")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "guardrails"
                  ? "font-bold text-black"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Shield className="h-4 w-4" />
              Guardrails
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "support"
                  ? "font-bold text-black"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <MailIcon className="h-4 w-4" />
              Support
            </button>
            <button
              onClick={() => setActiveTab("logout")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "logout"
                  ? "font-bold text-red-600"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
