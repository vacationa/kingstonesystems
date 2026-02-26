"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/app/context/demo-mode-context";
import {
  PlusIcon,
  Lock,
  Send,
  Users,
  TrendingUp,
  Infinity,
  Pause,
  Play,
  Clock,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CampaignDetails } from "./CampaignDetails";
import { DeleteCampaignModal } from "./DeleteCampaignModal";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[] | ((prev: Campaign[]) => Campaign[])) => void;
  onToggleCampaign: (id: string, status?: Campaign["status"], startDate?: string) => void;
  onStartCampaign: () => void;
  importStatus: {
    remainingImports: number;
  } | null;
  setShowNewCampaignModal: (show: boolean) => void;
  setSelectedCampaign?: (campaign: Campaign | null) => void;
  refreshMetrics?: () => Promise<void>;
  blockActions?: boolean;
}

export function CampaignList({
  campaigns,
  setCampaigns,
  onToggleCampaign,
  onStartCampaign,
  importStatus,
  setShowNewCampaignModal,
  setSelectedCampaign,
  refreshMetrics,
  blockActions = false,
}: CampaignListProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [paginatedCampaigns, setPaginatedCampaigns] = useState<Campaign[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null,
  });
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  const { isDemoMode } = useDemoMode();

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const res = await fetch(`/api/campaigns?limit=${limit}&offset=${offset}`);
      const data = await res.json();

      setPaginatedCampaigns(data.campaigns || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignsWithoutLoading = async () => {
    try {
      const offset = (page - 1) * limit;
      const res = await fetch(`/api/campaigns?limit=${limit}&offset=${offset}`);
      const data = await res.json();

      setPaginatedCampaigns(data.campaigns || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
    }
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

      // Оновити список кампаній
      await fetchCampaignsWithoutLoading();

      // Оновити метрики після видалення кампанії
      if (refreshMetrics) {
        await refreshMetrics();
      }
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    // For demo mode, use campaigns from props
    if (isDemoMode && campaigns.length > 0) {
      setPaginatedCampaigns(campaigns);
      setTotalCount(campaigns.length);
      setLoading(false);
      return;
    }

    // For non-demo mode, fetch paginated campaigns
    fetchCampaigns();
  }, [page, campaigns.length, isDemoMode]);

  // Set loading when page changes
  useEffect(() => {
    if (!isDemoMode) {
      setLoading(true);
    }
  }, [page, isDemoMode]);

  // Sync paginated campaigns with real-time updates (only for first page)
  useEffect(() => {
    if (!isDemoMode && campaigns.length > 0 && !loading && page === 1) {
      const currentPageCampaigns = campaigns.slice(0, limit);
      if (currentPageCampaigns.length > 0) {
        setPaginatedCampaigns(currentPageCampaigns);
      }
    }
  }, [campaigns, isDemoMode, loading]);

  if (setSelectedCampaign && selectedCampaignDetails) {
    setSelectedCampaign(selectedCampaignDetails);
    setSelectedCampaignDetails(null);
    return null;
  }

  if (selectedCampaignDetails) {
    return (
      <CampaignDetails
        campaign={selectedCampaignDetails}
        onBack={() => {
          if (setSelectedCampaign) setSelectedCampaign(null);
          setSelectedCampaignDetails(null);
        }}
        onToggleCampaign={onToggleCampaign}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-shrink-0 py-2 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex flex-col gap-1 max-w-[320px]">
            <h2 className="text-xl  text-slate-900 tracking-tight">Campaigns</h2>
            <p className="text-slate-500 text-sm  font-light whitespace-nowrap overflow-hidden text-ellipsis">
              Manage your campaigns
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0 items-stretch sm:items-center w-full sm:w-auto">
            <button
              onClick={() => !blockActions && setShowNewCampaignModal(true)}
              className="px-6 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
              disabled={blockActions}
            >
              <PlusIcon className="h-4 w-4" />
              New
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col pb-6">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-4">
            <LoadingSpinner className="w-8 h-8 mb-4" />
            <p className="text-sm text-center max-w-md ">Loading campaigns...</p>
          </div>
        ) : paginatedCampaigns.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-4">
            <p className="text-sm text-center max-w-md  mb-4">
              Create your first campaign to start connecting with your ICP
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-0">
            {paginatedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between hover:bg-slate-50/50 transition-all duration-200 cursor-pointer py-3"
                onClick={() => {
                  if (setSelectedCampaign) {
                    setSelectedCampaign(campaign);
                  } else {
                    setSelectedCampaignDetails(campaign);
                  }
                }}
              >
                <div className="flex-1 min-w-0 max-w-[200px]">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm  text-slate-900 tracking-tight truncate">
                      {campaign.name}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-medium flex items-center gap-1  tracking-wide",
                        campaign.status === "active" && "bg-[#0A66C2]/5 text-[#0A66C2]",
                        campaign.status === "paused" && "bg-slate-50 text-slate-600",
                        campaign.status === "completed" && "bg-slate-50 text-slate-500",
                        campaign.status === "queued" && "bg-amber-50 text-amber-600",
                      )}
                    >
                      {campaign.status === "active" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />
                      )}
                      {campaign.status === "paused" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      )}
                      {campaign.status === "completed" && (
                        <svg
                          className="w-2 h-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {campaign.status === "queued" && (
                        <svg
                          className="w-2 h-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-help">
                            <Send className="h-3 w-3 text-slate-500" />
                            <p className="text-xs  font-normal text-slate-900">
                              {campaign.sent}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className=" text-xs"
                        >
                          Total connection requests sent
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-help">
                            <Users className="h-3 w-3 text-slate-500" />
                            <p className="text-xs  font-normal text-slate-900">
                              {campaign.accepted}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className=" text-xs"
                        >
                          Number of accepted connections
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-help">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <p className="text-xs  font-normal text-slate-900">
                              {campaign.invited}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className=" text-xs"
                        >
                          Pending connection requests
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-help">
                            <TrendingUp className="h-3 w-3 text-slate-500" />
                            <p className="text-[10px]  font-bold text-slate-900">
                              {campaign.responseRate}%
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className=" text-xs"
                        >
                          Acceptance rate: percentage of sent requests that were accepted
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {campaign.status === "active" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const optimisticStatus = "paused" as const;
                        setCampaigns((prev: Campaign[]) =>
                          prev.map((c: Campaign) =>
                            c.id === campaign.id ? { ...c, status: optimisticStatus } : c,
                          ),
                        );
                        try {
                          onToggleCampaign(
                            campaign.id.toString(),
                            campaign.status,
                            campaign.start_date,
                          );
                        } catch (error) {
                          setCampaigns((prev: Campaign[]) =>
                            prev.map((c: Campaign) =>
                              c.id === campaign.id ? { ...c, status: campaign.status } : c,
                            ),
                          );
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-all duration-200  hover:scale-105 text-red-500 hover:bg-red-50",
                      )}
                      title="Pause campaign"
                    >
                      <Pause className="h-3 w-3" />
                    </button>
                  )}
                  {campaign.status === "paused" && (
                    <button
                      onClick={(e) => {
                        if (blockActions) return;
                        e.stopPropagation();
                        const optimisticStatus = "active" as const;
                        setCampaigns((prev: Campaign[]) =>
                          prev.map((c: Campaign) =>
                            c.id === campaign.id ? { ...c, status: optimisticStatus } : c,
                          ),
                        );
                        try {
                          onToggleCampaign(
                            campaign.id.toString(),
                            campaign.status,
                            campaign.start_date,
                          );
                        } catch (error) {
                          setCampaigns((prev: Campaign[]) =>
                            prev.map((c: Campaign) =>
                              c.id === campaign.id ? { ...c, status: campaign.status } : c,
                            ),
                          );
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-all duration-200  hover:scale-105 text-[#0A66C2] hover:bg-[#0A66C2]/10",
                      )}
                      disabled={blockActions}
                      title="Resume campaign"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ isOpen: true, campaign });
                    }}
                    className="p-1.5 rounded-lg transition-all duration-200  hover:scale-105 text-red-500 hover:bg-red-50"
                    title="Delete campaign"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex-shrink-0 border-t border-slate-50 px-6 py-4 pb-8">
          <div className="flex items-center justify-center gap-1">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm  transition-all duration-200",
                page === 1 || loading
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm  transition-all duration-200",
                      page === pageNum
                        ? "bg-[#0A66C2] text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm  transition-all duration-200",
                page === totalPages || loading
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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

function CampaignCard({
  campaign,
  onToggle,
  onSelect,
}: {
  campaign: Campaign;
  onToggle: (id: number, status: string) => void;
  onSelect: (campaign: Campaign) => void;
}) {
  return (
    <div
      className="group p-5 bg-white rounded-2xl border border-black/10 hover:border-[#0A66C2]/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(campaign)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg  text-slate-900 truncate tracking-tight">
              {campaign.name}
            </h3>
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5  tracking-wide",
                campaign.status === "active" && "bg-[#0A66C2]/10 text-[#0A66C2]",
                campaign.status === "paused" && "bg-slate-50 text-slate-600",
                campaign.status === "completed" && "bg-slate-50 text-slate-500",
                campaign.status === "queued" && "bg-amber-50 text-amber-600",
              )}
            >
              {campaign.status === "active" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />
              )}
              {campaign.status === "paused" && (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              )}
              {campaign.status === "completed" && (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {campaign.status === "queued" && (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-600 ">
            <div className="flex items-center gap-1.5">
              <Send className="h-4 w-4 text-[#0A66C2]" />
              <span className="">{campaign.sent} sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#0A66C2]" />
              <span className="">{campaign.accepted} accepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#0A66C2]" />
              <span className="">{campaign.responseRate}% response rate</span>
            </div>
          </div>
        </div>

        <div>
          {campaign.status === "active" && (
            <button
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(campaign.id, campaign.status);
              }}
              title="Pause campaign"
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 shadow-sm translate-x-6",
                )}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "up":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-[#0A66C2]/5 text-[#0A66C2] text-[10px] font-medium rounded  leading-none">
          <div className="w-1 h-1 rounded-full bg-[#0A66C2] animate-pulse" />
          <span>Active</span>
        </span>
      );
    case "down":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded  leading-none">
          <div className="w-1 h-1 rounded-full bg-slate-400" />
          <span>Paused</span>
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded  leading-none">
          <svg
            className="w-2 h-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Done</span>
        </span>
      );
    default:
      return null;
  }
}
