import {
  ArrowLeft,
  Calendar,
  Search,
  Users,
  Send,
  TrendingUp,
  ExternalLink,
  Lock,
  Pause,
  Play,
  Clock,
  Settings as SettingsIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { formatUrlForDisplay } from "@/utils/utils";
import { X } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { DeleteCampaignModal } from "./DeleteCampaignModal";
import { createClient } from "@/utils/supabase/client";
import { useRealtime } from "@/app/context/realtime-context";

interface Person {
  id: number;
  name: string;
  headline: string;
  company: string;
  lastMessage: string;
  status: string;
  skip_reason?: string;
  profileUrl: string;
}

import type { Campaign as BaseCampaign } from "../types";

interface Campaign extends Omit<BaseCampaign, "start_date" | "end_date"> {
  start_date: string | number | Date;
  end_date: string | number | Date;
}

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onToggleCampaign: (id: string, status?: BaseCampaign["status"], startDate?: string) => void;
  isSubscribed?: boolean;
  refreshMetrics?: () => Promise<void>;
}

export function CampaignDetails({
  campaign,
  onBack,
  onToggleCampaign,
  isSubscribed,
  refreshMetrics,
}: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "contacts">("contacts");
  const [connections, setConnections] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [localCampaign, setLocalCampaign] = useState(campaign);
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);
  const [totalImports, setTotalImports] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const ITEMS_PER_PAGE = 20;
  const supabase = createClient();
  const { refreshCampaigns } = useRealtime();

  const toDate = (input: string | number | Date | null | undefined): Date | null => {
    if (!input) return null;

    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }

    if (typeof input === "number") {
      // Якщо це timestamp в секундах — конвертуємо у мс
      const ms = input < 1e12 ? input * 1000 : input;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof input === "string") {
      const s = input.trim();
      if (!s || s === "null" || s === "undefined") return null;

      // Підтримка "YYYY-MM-DD HH:mm" → "YYYY-MM-DDTHH:mm" (Safari-friendly)
      const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?$/);
      const norm = m ? `${m[1]}T${m[2]}` : s;

      const d = new Date(norm);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  };

  const getLocale = () => (typeof navigator !== "undefined" ? navigator.language : undefined);

  const formatDate = (dateInput: string | number | Date) => {
    const d = toDate(dateInput);
    if (!d) return "—";
    return new Intl.DateTimeFormat(getLocale(), {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  };

  const formatDateTime = (dateInput: string | number | Date) => {
    const d = toDate(dateInput);
    if (!d) return "—";
    return new Intl.DateTimeFormat(getLocale(), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // за бажанням: показати тайзону
      // timeZoneName: "short",
    }).format(d);
  };

  const handleDeleteCampaign = async () => {
    if (!deleteModal.campaign) return;

    try {
      const response = await fetch(`/api/campaigns/${deleteModal.campaign.id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }

      // Оновити метрики після видалення кампанії
      if (refreshMetrics) {
        await refreshMetrics();
      }

      // Оновити список кампаній після видалення
      await refreshCampaigns();

      // Повернутися до списку кампаній після видалення
      onBack();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setLocalCampaign(campaign);
  }, [campaign]);

  const tabs = [
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "settings", label: "Settings", icon: Search },
  ] as const;

  // Fetch connections with pagination
  const fetchConnections = useCallback(
    (page = 1) => {
      if (!campaign?.id) return;

      setLoading(true);

      // Demo data for Enterprise Security Leaders campaign
      if (campaign.id === 1) {
        const demoConnections = [
          {
            id: 1,
            name: "Dr. Maria Santos",
            headline: "Chief Information Security Officer",
            company: "MedTech Solutions",
            lastMessage: "Accepted your connection request.",
            status: "connected",
            profileUrl: "https://linkedin.com/in/maria-santos-ciso",
          },
          {
            id: 2,
            name: "James Park",
            headline: "VP of Cybersecurity",
            company: "SecureNet Systems",
            lastMessage: "Sent follow-up message about AI security solutions.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/james-park-security",
          },
          {
            id: 3,
            name: "Dr. Sarah Chen",
            headline: "Director of Information Security",
            company: "FinTech Global",
            lastMessage: "Sent follow-up message about enterprise security automation.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/sarah-chen-cybersecurity",
          },
          {
            id: 4,
            name: "Michael Rodriguez",
            headline: "CISO",
            company: "CloudSecure Inc",
            lastMessage: "Sent follow-up message about next-gen security platforms.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/michael-rodriguez-ciso",
          },
          {
            id: 5,
            name: "Dr. Elena Petrov",
            headline: "Head of Security Architecture",
            company: "EnterpriseGuard",
            lastMessage: "Sent follow-up message about AI-powered threat detection.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/elena-petrov-security",
          },
          {
            id: 6,
            name: "Alex Thompson",
            headline: "VP of Security Operations",
            company: "CyberDefense Corp",
            lastMessage: "Sent follow-up message about automated security workflows.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/alex-thompson-cyber",
          },
          {
            id: 7,
            name: "Dr. Priya Patel",
            headline: "Chief Security Officer",
            company: "DataGuard Solutions",
            lastMessage: "Sent connection request for security leadership insights.",
            status: "sent",
            profileUrl: "https://linkedin.com/in/priya-patel-cso",
          },
          {
            id: 8,
            name: "Carlos Mendez",
            headline: "Director of Risk Management",
            company: "SecureTech Ventures",
            lastMessage: "Sent follow-up message about security automation tools.",
            status: "followup_message_send",
            profileUrl: "https://linkedin.com/in/carlos-mendez-risk",
          },
        ];

        setConnections(demoConnections);
        setTotalCount(demoConnections.length);
        setTotalPages(1);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      fetch(
        `/api/campaigns/fetch-connections?campaignId=${campaign.id}&page=${page}&limit=${ITEMS_PER_PAGE}`,
      )
        .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
        .then(({ ok, json }) => {
          if (ok) {
            const parsed = json.data
              .filter((entry: any) => entry.first_name) // Filter out entries without a first_name
              .map((entry: any) => ({
                id: entry.id,
                name:
                  entry.display_name.split("View")[0] || `${entry.first_name} ${entry.last_name}`,
                headline: entry.headline,
                company: entry.current_company,
                lastMessage: entry.last_message || "No messages yet",
                status: entry.status,
                skip_reason: entry.skip_reason,
                profileUrl: entry.profile_url,
              }));
            setConnections(parsed);

            // Update pagination info
            if (json.pagination) {
              setTotalCount(json.pagination.total);
              setTotalPages(json.pagination.totalPages);
              setCurrentPage(json.pagination.page);
            }
          } else {
            console.error("Failed to load connections:", json.error);
          }
        })
        .catch((err) => console.error("Unexpected error:", err))
        .finally(() => setLoading(false));
    },
    [campaign.id, ITEMS_PER_PAGE],
  );

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setLoading(true);
      fetchConnections(page);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (campaign?.id) {
      fetchConnections(1);
    }
  }, [campaign.id, fetchConnections]);

  // Realtime updates for this campaign's connections
  useEffect(() => {
    if (!campaign?.id) return;

    const channel = supabase
      .channel(`connections-campaign-${campaign.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "linkedin_connections",
          filter: `campaign_id=eq.${campaign.id}`,
        },
        () => {
          // Refetch current page on any change for this campaign
          fetchConnections(currentPage);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [campaign.id, supabase]);

  // Fetch campaign metrics for total imports
  useEffect(() => {
    if (!campaign?.id) return;

    setMetricsLoading(true);
    fetch(`/api/campaigns/${campaign.id}/metrics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.totalImported !== undefined) {
          setTotalImports(data.totalImported);
        }
      })
      .catch((err) => console.error("Failed to load campaign metrics:", err))
      .finally(() => setMetricsLoading(false));
  }, [campaign.id]);

  return (
    <div className="flex flex-col overflow-hidden bg-white rounded-xl min-h-0 flex-1">
      {/* Header */}
      <div className="flex flex-col flex-shrink-0 py-2 px-4 h-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex flex-col gap-1 max-w-[320px] min-w-0">
            <h2 className="text-xl font-aeonik text-slate-900 tracking-tight truncate">
              {campaign.name}
            </h2>
            <p className="text-slate-500 text-sm font-aeonik font-light whitespace-nowrap overflow-hidden text-ellipsis">
              View and manage your campaign
            </p>
          </div>
          <div className="w-full sm:w-auto flex items-center justify-center">
            <div className="flex bg-slate-50 rounded-xl p-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("contacts")}
                className={cn(
                  "px-4 py-2 text-sm font-aeonik font-medium transition-all duration-200 rounded-lg flex-1 sm:flex-none sm:min-w-[100px]",
                  activeTab === "contacts"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "px-4 py-2 text-sm font-aeonik font-medium transition-all duration-200 rounded-lg flex-1 sm:flex-none sm:min-w-[100px]",
                  activeTab === "settings"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {activeTab === "contacts" ? (
              /* Contacts Section */
              <div className="flex flex-col min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="sm" color="primary" />
                  </div>
                ) : connections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 py-8">
                    <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-[#0A66C2]" />
                    </div>
                    <p className="text-sm font-aeonik font-medium text-slate-700 mb-1">
                      Your campaign is starting soon
                    </p>
                    <p className="text-xs font-aeonik text-slate-500 text-center max-w-xs">
                      We'll begin connecting with your target audience according to your campaign
                      schedule
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 min-h-0 flex-1 overflow-y-auto">
                    {connections.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Left: Name, Headline, Company */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-bold text-slate-900 font-aeonik truncate">
                              {person.name}
                            </p>
                            <a
                              href={person.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          {/* <p className="text-xs text-slate-500 font-aeonik truncate">
                          {person.headline}
                        </p> */}
                          <p className="text-xs text-slate-400 font-aeonik truncate mt-0.5">
                            {person.company}
                          </p>
                        </div>

                        {/* Right: Status badge and X */}
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium font-aeonik",
                              person.status === "queued" && "bg-blue-50 text-blue-600",
                              (person.status === "invited" || person.status === "pending") &&
                                "bg-slate-100 text-slate-700",
                              person.status === "connected" && "bg-green-100 text-green-700",
                              person.status === "followup_message_send" &&
                                "bg-slate-100 text-slate-700",
                              person.status === "second_followup_message_send" &&
                                "bg-slate-100 text-slate-700",
                              person.status === "cancelled" &&
                                person.skip_reason === "blocked_profile" &&
                                "bg-red-50 text-red-600",
                              person.status === "cancelled" &&
                                person.skip_reason !== "blocked_profile" &&
                                "bg-slate-200 text-slate-400",
                            )}
                          >
                            {person.status === "queued" && "Collected"}
                            {(person.status === "invited" || person.status === "pending") &&
                              "Request sent"}
                            {person.status === "connected" && "Connected"}
                            {person.status === "followup_message_send" && "1st follow-up sent"}
                            {person.status === "second_followup_message_send" &&
                              "2nd follow-up sent"}
                            {person.status === "cancelled" &&
                              person.skip_reason === "blocked_profile" &&
                              "Blocked"}
                            {person.status === "cancelled" &&
                              person.skip_reason !== "blocked_profile" &&
                              "Cancelled"}
                          </span>
                          <X
                            className={cn(
                              "h-4 w-4 cursor-pointer transition-colors",
                              cancelledIds.includes(person.id)
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-500",
                            )}
                            onClick={() => {
                              if (cancelledIds.includes(person.id)) return; // prevent re-cancel

                              // Optimistically update UI
                              setConnections((prev) =>
                                prev.map((p) =>
                                  p.id === person.id ? { ...p, status: "cancelled" } : p,
                                ),
                              );
                              setCancelledIds((prev) => [...prev, person.id]);

                              // Fire cancellation API (no rollback needed)
                              fetch("/api/connect/cancel", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ connectionId: person.id }),
                              }).catch((err) => {
                                console.error("Failed to cancel:", err);
                                // Optional: remove from cancelledIds if you want to retry
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Campaign Settings Section */
              <div className="space-y-8">
                {/* Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-aeonik font-medium text-slate-700 uppercase tracking-wide mb-4">
                    Settings
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    <span className="text-sm text-slate-600">Campaign Type</span>
                    <span className="text-sm text-slate-900 text-right">
                      {(() => {
                        switch (campaign.campaign_type) {
                          case "search":
                            return "Search URL";
                          case "csv":
                            return "CSV Import";
                          case "reactions":
                            return "Post Likes";
                          case "comments":
                            return "Post Comments";
                          case "event":
                            return "Event";
                          case "sales_navigator":
                            return "Sales Navigator";
                          default:
                            return "Search URL";
                        }
                      })()}
                    </span>

                    {(campaign.campaign_type === "search" ||
                      campaign.campaign_type === "reactions" ||
                      campaign.campaign_type === "comments" ||
                      campaign.campaign_type === "event" ||
                      campaign.campaign_type === "sales_navigator") && (
                      <>
                        <span className="text-sm text-slate-600 mt-4">Source URL</span>
                        <span className="flex flex-col items-end gap-1">
                          {typeof campaign.linkedin_url === "string" ? (
                            <>
                              <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#0A66C2]/30 transition-colors rounded-xl px-4 py-2.5 w-full max-w-xs group">
                                <a
                                  href={campaign.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="truncate text-slate-600 text-sm hover:text-[#0A66C2] transition-colors flex-1 font-aeonik"
                                  title={campaign.linkedin_url}
                                >
                                  {formatUrlForDisplay(String(campaign.linkedin_url))}
                                </a>
                                <button
                                  type="button"
                                  className="ml-1 text-slate-400 hover:text-[#0A66C2] transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                                  onClick={() => {
                                    navigator.clipboard.writeText(campaign.linkedin_url);
                                  }}
                                  title="Copy URL"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                  </svg>
                                </button>
                                <a
                                  href={campaign.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 text-slate-400 hover:text-[#0A66C2] transition-colors opacity-0 group-hover:opacity-100"
                                  title="Open in new tab"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
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
                              {campaign.campaign_type === "search" &&
                                (() => {
                                  try {
                                    const keywords = new URL(
                                      campaign.linkedin_url,
                                    ).searchParams.get("keywords");
                                    return keywords ? (
                                      <span className="inline-flex items-center bg-slate-50 text-slate-600 text-xs font-medium rounded-lg px-2.5 py-1.5 mt-2 border border-slate-200">
                                        <svg
                                          className="w-3 h-3 mr-1.5 text-slate-500"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                        {keywords}
                                      </span>
                                    ) : null;
                                  } catch {
                                    return null;
                                  }
                                })()}
                            </>
                          ) : (
                            <span className="text-xs text-slate-400">No URL available</span>
                          )}
                        </span>
                      </>
                    )}
                    <span className="text-sm text-slate-600">Start Date</span>
                    <span className="text-sm text-slate-900 text-right font-medium">
                      {formatDateTime(String(campaign.start_date))}
                    </span>
                    <span className="text-sm text-slate-600">End Date</span>
                    <span className="text-sm text-slate-900 text-right font-medium">
                      {formatDateTime(String(campaign.end_date))}
                    </span>
                    <span className="text-sm text-slate-600">Total Imports</span>
                    <span className="text-sm text-slate-900 text-right font-medium">
                      {metricsLoading ? (
                        <span className="text-slate-400">Loading...</span>
                      ) : (
                        totalImports.toLocaleString()
                      )}
                    </span>
                  </div>
                </div>
                {/* Messages */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-aeonik font-medium text-slate-700 uppercase tracking-wide mb-4">
                    Messages & Timing
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Connection Message</p>
                      <div className="bg-slate-50 p-3 rounded border text-sm text-slate-900 font-aeonik whitespace-pre-line">
                        {campaign.connection_message}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Follow-up Message</p>
                      <div className="bg-slate-50 p-3 rounded border text-sm text-slate-900 font-aeonik whitespace-pre-line">
                        {campaign.follow_up_message}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          Sent after {campaign.follow_up_days} day
                          {campaign.follow_up_days !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Second Follow-up</p>
                      <div className="bg-slate-50 p-3 rounded border text-sm text-slate-900 font-aeonik whitespace-pre-line">
                        {campaign.second_follow_up_message}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          Sent after {campaign.second_follow_up_days} day
                          {campaign.second_follow_up_days !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Pagination Controls - Always present for contacts tab */}
      {activeTab === "contacts" && (
        <div className="flex-shrink-0 border-t border-slate-50 px-6 py-3 bg-white h-16 flex items-center justify-center">
          <div className="flex items-center justify-center gap-1">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading || totalPages <= 1}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-aeonik transition-all duration-200",
                currentPage <= 1 || loading || totalPages <= 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers or contact count */}
            <div className="flex items-center gap-1 mx-2">
              {totalPages > 1 ? (
                Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-aeonik transition-all duration-200",
                        currentPage === pageNum
                          ? "bg-[#0A66C2] text-white"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-slate-400 font-aeonik px-4">
                  {totalCount > 0
                    ? `${totalCount} contact${totalCount !== 1 ? "s" : ""}`
                    : "No contacts yet"}
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading || totalPages <= 1}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-aeonik transition-all duration-200",
                currentPage >= totalPages || loading || totalPages <= 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 h-16 flex-shrink-0">
        <button
          onClick={onBack}
          className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-aeonik font-medium flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </button>
        <div className="flex items-center gap-2">
          {localCampaign.status === "active" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Only allow pausing when active
                const newStatus = "paused";
                setLocalCampaign({ ...localCampaign, status: newStatus });
                onToggleCampaign(
                  localCampaign.id.toString(),
                  localCampaign.status,
                  String(localCampaign.start_date ?? ""),
                );
              }}
              className={cn(
                "px-3 py-2 text-sm transition-colors font-aeonik font-medium flex items-center gap-2 text-slate-600 hover:text-slate-900",
              )}
            >
              <Pause className="h-4 w-4" />
              Pause Campaign
            </button>
          ) : localCampaign.status === "queued" ? (
            <span className="text-sm text-slate-500 font-aeonik">
              Scheduled to start at {formatDateTime(String(localCampaign.start_date))}
            </span>
          ) : null}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, campaign: localCampaign });
            }}
            className="px-3 py-2 text-sm text-red-500 hover:text-red-700 transition-colors font-aeonik font-medium flex items-center gap-2"
            title="Delete campaign"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Campaign Modal */}
      <DeleteCampaignModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, campaign: null })}
        onConfirm={handleDeleteCampaign}
        campaignName={deleteModal.campaign?.name || ""}
      />
    </div>
  );
}
