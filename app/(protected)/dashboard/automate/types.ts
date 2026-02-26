export interface Campaign {
  id: number;
  name: string;
  trending: string;
  searchQuery: string;
  startDate: string;
  endDate: string;
  sent: number;
  accepted: number;
  pending: number;
  invited: number;
  responseRate: number;
  status: "queued" | "collecting" | "ready" | "active" | "paused" | "completed";
  campaign_type?: "search" | "csv" | "reactions" | "comments" | "event" | "sales_navigator";
  linkedin_url: string;
  connection_message: string;
  follow_up_message: string;
  second_follow_up_message: string;
  follow_up_days: number;
  second_follow_up_days: number;
  cancelled: number;
  start_date: string;
  end_date: string;
  // Optional metrics fields that may come from the API
  totalMessages?: number;
  dailyAverage?: number;
  weeklyGrowth?: number;
  weeklyData?: number[];
}
