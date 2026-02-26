import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type DayBucket = {
  date: string;
  label: string;
  startUTC: string; // ISO
  endUTC: string; // ISO
};

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const campaignId: string | null = body.campaignId ?? null;
  const timeRange: "7d" | "30d" | "90d" = body.timeRange ?? "7d";
  const days: DayBucket[] = Array.isArray(body.days) ? body.days : [];
  const rangeStartUTC: string = body.rangeStartUTC;
  const rangeEndUTC: string = body.rangeEndUTC;

  if (!days.length || !rangeStartUTC || !rangeEndUTC) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    // Отримуємо активні кампанії
    const { data: activeCampaigns, error: campaignsError } = await supabase
      .from("linkedin_campaigns")
      .select("id")
      .eq("user_id", user.id);

    if (campaignsError) {
      return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }

    const activeCampaignIds = activeCampaigns?.map((c) => c.id) || [];
    if (!activeCampaignIds.length) {
      return NextResponse.json({
        data: [],
        totalSent: 0,
        totalAccepted: 0,
        totalMessages: 0,
        totalResponses: 0,
      });
    }

    // Базові фільтри
    const baseCampaignFilter = campaignId ? [campaignId] : activeCampaignIds;

    // Загальний часовий фільтр по всьому діапазону — мінімізує об'єм даних
    const [sentResult, acceptedResult, messagesResult, responsesResult] = await Promise.all([
      supabase
        .from("linkedin_logs")
        .select("created_at, job_type, message, campaign_id")
        .eq("user_id", user.id)
        .eq("log_level", "info")
        .eq("job_type", "followRequest")
        .in("campaign_id", baseCampaignFilter)
        .ilike("message", "%Connection request sent to%")
        .gte("created_at", rangeStartUTC)
        .lt("created_at", rangeEndUTC)
        .order("created_at", { ascending: true }),

      supabase
        .from("linkedin_logs")
        .select("created_at, job_type, message, campaign_id")
        .eq("user_id", user.id)
        .eq("log_level", "info")
        .eq("job_type", "followResponse")
        .in("campaign_id", baseCampaignFilter)
        .ilike("message", "%Invite accepted by%")
        .gte("created_at", rangeStartUTC)
        .lt("created_at", rangeEndUTC)
        .order("created_at", { ascending: true }),

      supabase
        .from("linkedin_logs")
        .select("created_at, job_type, message, campaign_id")
        .eq("user_id", user.id)
        .eq("log_level", "info")
        .in("job_type", ["sendMessage", "followup_message_send", "second_followup_message_send"])
        .in("campaign_id", baseCampaignFilter)
        .or(
          "message.ilike.%Sent message to%,message.ilike.%Sent 1st follow-up message to%,message.ilike.%Sent 2nd follow-up message to%",
        )
        .gte("created_at", rangeStartUTC)
        .lt("created_at", rangeEndUTC)
        .order("created_at", { ascending: true }),

      supabase
        .from("linkedin_connections")
        .select("reply_received_at, campaign_id")
        .not("reply_received_at", "is", null)
        .in("campaign_id", baseCampaignFilter)
        .gte("reply_received_at", rangeStartUTC)
        .lt("reply_received_at", rangeEndUTC),
    ]);

    // помилки
    for (const [name, res] of [
      ["sent", sentResult],
      ["accepted", acceptedResult],
      ["messages", messagesResult],
      ["responses", responsesResult],
    ] as const) {
      if ((res as any).error) {
        console.error(`Error fetching ${name}:`, (res as any).error);
        return NextResponse.json({ error: `Failed to fetch ${name} data` }, { status: 500 });
      }
    }

    const sentLogs = sentResult.data ?? [];
    const acceptedLogs = acceptedResult.data ?? [];
    const messagesLogs = messagesResult.data ?? [];
    const responsesData = responsesResult.data ?? [];

    // Бакетизація по надісланих межах кожного дня (UTC)
    const dailyCounts = days.map((day) => {
      const start = new Date(day.startUTC).getTime();
      const end = new Date(day.endUTC).getTime();

      const sent = sentLogs.filter((l) => {
        const t = new Date(l.created_at).getTime();
        return t >= start && t < end;
      }).length;

      const accepted = acceptedLogs.filter((l) => {
        const t = new Date(l.created_at).getTime();
        return t >= start && t < end;
      }).length;

      const messages = messagesLogs.filter((l) => {
        const t = new Date(l.created_at).getTime();
        return t >= start && t < end;
      }).length;

      const responses = responsesData.filter((r) => {
        const t = new Date(r.reply_received_at).getTime();
        return t >= start && t < end;
      }).length;

      return {
        date: day.date,
        label: day.label,
        sent,
        accepted,
        messages,
        responses,
      };
    });

    return NextResponse.json({
      data: dailyCounts,
      totalSent: sentLogs.length,
      totalAccepted: acceptedLogs.length,
      totalMessages: messagesLogs.length,
      totalResponses: responsesData.length,
    });
  } catch (error) {
    console.error("Error in connection-requests-chart API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
