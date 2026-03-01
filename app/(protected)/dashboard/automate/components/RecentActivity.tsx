import {
  Users, // for collectProfiles
  Send, // for followRequest
  CheckCircle, // for followResponse
  MessageCircle, // for sendMessage
  Reply, // for followup_message_send
  ReplyAll, // for second_followup_message_send
  Eye, // for visit activities
  Info, // fallback - info icon for unknown activities
  ExternalLink, // for LinkedIn profile links
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@/app/context/realtime-context";

interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  status: "info" | "warn" | "error" | "success" | "pending";
  target_name?: string | null;
  profile_url?: string | null;

  campaign_name?: string | null;
  campaign_id?: string | null;
}

interface RecentActivityProps {
  activities?: Activity[];
  selectedCampaignId?: string | null;
}

export function RecentActivity({ selectedCampaignId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activities: realtimeActivities = [] } = useRealtime();

  const ITEMS_PER_PAGE = 10;

  const getJobTypesForFilter = (filter: string): string[] => {
    switch (filter) {
      case "all":
        return ["all"];
      case "campaign":
        return ["collectProfiles"];
      case "followRequest":
        return ["followRequest"];
      case "followResponse":
        return ["followResponse"];
      case "messages":
        return ["sendMessage", "followup_message_send", "second_followup_message_send"];
      default:
        return [filter];
    }
  };

  // Fetch logs (with page-based pagination)
  const fetchLogs = async (page = 1) => {
    const jobTypes = getJobTypesForFilter(activeFilter);
    const isAllFilter = jobTypes.includes("all");
    const params = new URLSearchParams({
      limit: ITEMS_PER_PAGE.toString(),
      page: page.toString(),
    });

    if (!isAllFilter) {
      jobTypes.forEach((jobType) => {
        params.append("job_type", jobType);
      });
    }

    // Add campaign_id filter if a campaign is selected
    if (selectedCampaignId) {
      params.append("campaign_id", selectedCampaignId);
    }

    try {
      const res = await fetch(`/api/logs?${params.toString()}`);
      const json = await res.json();
      const newLogs: Activity[] = (json.logs || []).map((log: any) => ({
        id: log.id,
        type: log.job_type,
        message: log.message,
        timestamp: log.created_at,
        status: log.log_level as "info" | "warn" | "error" | "success" | "pending",
        target_name: null,
        profile_url: log.context?.profile || null,
        campaign_name: log.context?.campaign_name ?? null,
        campaign_id: log.campaign_id ?? log.context?.campaign_id ?? null,
      }));

      setActivities(newLogs);

      // Update pagination info
      const total = json.total || 0;
      const pages = Math.ceil(total / ITEMS_PER_PAGE);
      setTotalCount(total);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch {
      setActivities([]);
      setTotalCount(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change or campaign selection
  useEffect(() => {
    setActivities([]);
    setCurrentPage(1);
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, selectedCampaignId]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setLoading(true);
      fetchLogs(page);
      // Scroll to top of activity list
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  };

  // Real-time: refetch first page when realtimeActivities changes
  useEffect(() => {
    if (!realtimeActivities?.length) return;

    // If there are new realtime activities - refresh the first page
    if (!loading) {
      setCurrentPage(1);
      fetchLogs(1);
    }
  }, [realtimeActivities, selectedCampaignId]);

  // Helper: Deduplicate activities by message, profile_url, and status (keep most recent)
  function deduplicateActivities(list: Activity[]): Activity[] {
    const seenIds = new Set<number>();
    const seenContent = new Set<string>();
    const out: Activity[] = [];

    for (const a of list) {
      const contentKey = `${a.type}|${a.campaign_id || ""}|${a.message}|${a.profile_url || ""}|${a.status}`;

      // Якщо такий id уже був → скіпаємо
      if (seenIds.has(a.id)) continue;

      // Якщо вже був запис з таким самим контентом (навіть з іншим id) → скіпаємо
      if (seenContent.has(contentKey)) continue;

      seenIds.add(a.id);
      seenContent.add(contentKey);
      out.push(a);
    }

    return out;
  }

  function ActivityIcon({ type, status }: { type?: string; status?: string }) {
    switch (type) {
      case "collectProfiles":
        return <Users className="h-4 w-4 text-primary" aria-label="Campaign" />;
      case "followRequest":
        return <Send className="h-4 w-4 text-primary" aria-label="Connection Sent" />;
      case "followResponse":
        return <CheckCircle className="h-4 w-4 text-green-600" aria-label="Accepted" />;
      case "sendMessage":
        return <MessageCircle className="h-4 w-4 text-slate-600" aria-label="Message Sent" />;
      case "followup_message_send":
        return <Reply className="h-4 w-4 text-slate-500" aria-label="Follow-up Sent" />;
      case "second_followup_message_send":
        return <ReplyAll className="h-4 w-4 text-slate-400" aria-label="Second Follow-up Sent" />;
      case "visit":
        return <Eye className="h-4 w-4 text-slate-600" aria-label="Profile Visited" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" aria-label="Other Activity" />;
    }
  }

  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "campaign", label: "Campaigns" },
    { value: "followRequest", label: "Sent Requests" },
    { value: "followResponse", label: "Accepted" },
    { value: "messages", label: "Messages" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-row items-center py-2 px-4 flex-shrink-0 gap-4">
        <div className="flex-shrink-0 flex items-center justify-between py-2 px-4 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
          <p className="text-slate-500 text-sm  font-light">See what's happening</p>
        </div>
        <div className="ml-auto">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-auto min-w-[100px] bg-white  focus:ring-0 focus:ring-offset-0 focus:outline-none px-2 [&>svg]:ml-1 border-none">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col pb-6" ref={scrollContainerRef}>
        {activities.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-4">
            <p className="text-sm text-center max-w-md  mb-4">
              Your connection activities will appear here
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-0">
            {deduplicateActivities(activities).map((activity) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3 py-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ActivityIcon type={activity.type} status={activity.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm  font-normal text-slate-900 truncate">
                        {(() => {
                          // Helper to render name + icon
                          const renderNameWithIcon = (name: string, profileUrl?: string | null) => (
                            <span className="inline-flex items-center gap-0.5">
                              <span>{name}</span>
                              {profileUrl && (
                                <a
                                  href={profileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View LinkedIn profile"
                                  className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </span>
                          );
                          // Case 0: Message like 'Name accepted your connection request'
                          // Use a broad, Unicode-friendly capture for names (handles emojis and non-Latin)
                          if (activity.type === "collectProfiles") {
                            const label = activity.campaign_name || "Campaign";
                            return (
                              <>
                                <span className="font-medium text-[#0A66C2]">{label}</span>:{" "}
                                {activity.message}
                              </>
                            );
                          }
                          const acceptedMatch = activity.message.match(
                            /^(.+?) accepted your connection request$/,
                          );
                          if (acceptedMatch) {
                            const name = acceptedMatch[1];
                            return (
                              <>
                                {renderNameWithIcon(name, activity.profile_url)} accepted your
                                connection request
                              </>
                            );
                          }
                          // Case 1: Message starts with 'Name - ...'
                          // Capture up to the delimiter ' - '
                          const nameHyphenMatch = activity.message.match(/^(.+?) - (.+)$/);
                          if (nameHyphenMatch) {
                            const name = nameHyphenMatch[1];
                            const rest = nameHyphenMatch[2];
                            return (
                              <>
                                {renderNameWithIcon(name, activity.profile_url)} - {rest}
                              </>
                            );
                          }
                          // Case 2: Sent ... to Name - ...
                          const match = activity.message.match(
                            /^(Sent (?:1st|2nd) follow-up message to |Sent connection request to |Sent message to |)?(.+?)(?:\s-.*)?$/,
                          );
                          if (match) {
                            const prefix = match[1] || "";
                            const name = match[2] || "";
                            return (
                              <>
                                {prefix}
                                {renderNameWithIcon(name, activity.profile_url)}
                              </>
                            );
                          }
                          // Fallback: show the raw message but still include the profile link icon if available
                          return (
                            <span className="inline-flex items-center gap-0.5">
                              <span>{activity.message}</span>
                              {activity.profile_url && (
                                <a
                                  href={activity.profile_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View LinkedIn profile"
                                  className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </span>
                          );
                        })()}
                      </p>
                      <span className="text-[10px] text-slate-500  whitespace-nowrap">
                        {activity.timestamp
                          ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 border-t border-slate-50 px-6 py-4 pb-8">
          <div className="flex items-center justify-center gap-1">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm  transition-all duration-200",
                currentPage <= 1 || loading
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                      "w-8 h-8 rounded-lg text-sm  transition-all duration-200",
                      currentPage === pageNum
                        ? "bg-[#0A66C2] text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm  transition-all duration-200",
                currentPage >= totalPages || loading
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
