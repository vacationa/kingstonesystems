import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { id: campaignId } = await params;

    // 1) auth
    const { data: { user } = {}, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) verify campaign belongs to user
    const { data: campaign, error: campErr } = await supabase
      .from("linkedin_campaigns")
      .select("id, created_at")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (campErr || !campaign) {
      console.error("Campaign fetch error:", campErr);
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // 3) Calculate metrics for this specific campaign
    // Total imported = count of all connections for this campaign
    const { count: totalImported = 0, error: importedError } = await supabase
      .from("linkedin_connections")
      .select("id", { head: true, count: "exact" })
      .eq("campaign_id", campaignId);

    if (importedError) {
      console.error("Total imported count error:", importedError);
      return NextResponse.json({ error: "Failed to load imported count" }, { status: 500 });
    }

    // Note: We'll calculate totalSent after getting all status counts
    // to include both currently invited and accepted connections

    // 4) count each status for this campaign
    const statuses = [
      "connected",
      "pending",
      "paused",
      "queued",
      "invited",
      "cancelled",
      "followup_message_send",
      "second_followup_message_send",
    ] as const;

    const counts: Record<(typeof statuses)[number], number> = {
      connected: 0,
      pending: 0,
      paused: 0,
      queued: 0,
      invited: 0,
      followup_message_send: 0,
      second_followup_message_send: 0,
      cancelled: 0,
    };

    for (const status of statuses) {
      const { count, error } = await supabase
        .from("linkedin_connections")
        .select("id", { head: true, count: "exact" })
        .eq("campaign_id", campaignId)
        .eq("status", status);
      if (error) {
        console.error(`Count error for ${status}:`, error);
        return NextResponse.json({ error: `Failed to load ${status} count` }, { status: 500 });
      }
      counts[status] = count || 0;
    }

    const accepted =
      counts.connected + counts.followup_message_send + counts.second_followup_message_send;
    const pending = counts.pending;
    const cancelled = counts.cancelled;

    // 5) Calculate totalSent to include both invited and accepted connections
    // This ensures we count all connections that were ever sent, even if they're now accepted
    const totalSent =
      counts.invited +
      counts.connected +
      counts.followup_message_send +
      counts.second_followup_message_send;

    // 6) rates & daily average
    const acceptanceRate = totalSent ? (accepted / totalSent) * 100 : 0;

    // 7) total messages calculation
    const { data: connections, error: connErr } = await supabase
      .from("linkedin_connections")
      .select(
        "follow_up_sent_at, second_follow_up_sent_at, reply_received_at, connection_note_sent_at",
      )
      .eq("campaign_id", campaignId);

    if (connErr) {
      console.error("Connections fetch error:", connErr);
      return NextResponse.json({ error: "Failed to load connections" }, { status: 500 });
    }

    const totalMessages = (connections || []).reduce((sum, connection) => {
      let messageCount = 0;
      if (connection.follow_up_sent_at) messageCount += 1;
      if (connection.second_follow_up_sent_at) messageCount += 1;
      if (connection.connection_note_sent_at) messageCount += 1;
      return sum + messageCount;
    }, 0);

    const { count: replied = 0, error: replErr } = await supabase
      .from("linkedin_connections")
      .select("id", { head: true, count: "exact" })
      .eq("campaign_id", campaignId)
      .not("reply_received_at", "is", null);
    if (replErr) {
      console.error("Replies count error:", replErr);
      return NextResponse.json({ error: "Failed to load replies count" }, { status: 500 });
    }

    // messaged
    const { count: messaged = 0, error: msgdErr } = await supabase
      .from("linkedin_connections")
      .select("id", { head: true, count: "exact" })
      .eq("campaign_id", campaignId)
      .or(
        "connection_note_sent_at.not.is.null,follow_up_sent_at.not.is.null,second_follow_up_sent_at.not.is.null",
      );
    if (msgdErr) {
      console.error("Messaged count error:", msgdErr);
      return NextResponse.json({ error: "Failed to load messaged count" }, { status: 500 });
    }

    const responseRate = messaged ? (replied / messaged) * 100 : 0;

    // 8) Calculate daily average and weekly growth
    const now = new Date();
    const campaignStartDate = new Date(campaign.created_at || now);
    const daysSinceStart = Math.max(
      1,
      Math.ceil((now.getTime() - campaignStartDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const dailyAverage = Math.round((totalSent || 0) / daysSinceStart);

    // Weekly growth calculation (simplified)
    const weeklyGrowth = Math.round(accepted / Math.max(1, Math.ceil(daysSinceStart / 7)));

    // 9) Weekly data (last 7 days) - simplified for now
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Placeholder

    return NextResponse.json({
      totalImported,
      totalSent,
      accepted,
      pending,
      cancelled,
      totalMessages,
      acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
      responseRate: parseFloat(responseRate.toFixed(1)),
      dailyAverage,
      weeklyGrowth,
      weeklyData,
    });
  } catch (error) {
    console.error("Campaign metrics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
