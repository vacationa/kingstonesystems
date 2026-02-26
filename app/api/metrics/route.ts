// app/api/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { exists } from "fs";
export const maxDuration = 59; // timeout: 59 seconds
export async function GET(request: NextRequest) {
  try {
    // 1) init supabase
    const supabase = await createClient();

    // 2) auth
    const { data: { user } = {}, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) fetch campaigns
    const { data: campaigns, error: campErr } = await supabase
      .from("linkedin_campaigns")
      .select("id, total_profiles, processed_profiles, start_date")
      .eq("user_id", user.id);
    if (campErr) {
      console.error("Campaign fetch error:", campErr);
      return NextResponse.json({ error: "Failed to load campaigns" }, { status: 500 });
    }

    // 4) no campaigns → zeros
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        totalImported: 0,
        totalSent: 0,
        accepted: 0,
        pending: 0,
        cancelled: 0,
        totalMessages: 0,
        acceptanceRate: 0,
        responseRate: 0,
        dailyAverage: 0,
        weeklyGrowth: 0,
        weeklyData: Array(7).fill(0),
      });
    }

    // 5) get campaign IDs for queries
    const campaignIds = campaigns?.map((c) => c.id) || [];

    // 6) Calculate REAL metrics from linkedin_connections table
    // Total imported = count of all connections for existing campaigns
    const { count: totalImported = 0, error: importedError } = await supabase
      .from("linkedin_connections")
      .select("id", { head: true, count: "exact" })
      .in("campaign_id", campaignIds);

    if (importedError) {
      console.error("Total imported count error:", importedError);
      return NextResponse.json({ error: "Failed to load imported count" }, { status: 500 });
    }

    // Note: We'll calculate totalSent after getting all status counts
    // to include both currently invited and accepted connections

    // 7) count each real status
    const statuses = [
      "connected", // was "accepted"
      "pending",
      "paused",
      "queued",
      "invited",
      "followup_message_send",
      "second_followup_message_send",
      "cancelled", // new status for cancelled connections
    ] as const;

    const counts: Record<(typeof statuses)[number], number> = {
      connected: 0,
      pending: 0,
      paused: 0,
      queued: 0,
      invited: 0,
      followup_message_send: 0,
      second_followup_message_send: 0,
      cancelled: 0, // new status for cancelled connections
    };

    for (const status of statuses) {
      const { count, error } = await supabase
        .from("linkedin_connections")
        .select("id", { head: true, count: "exact" })
        .in("campaign_id", campaignIds)
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
    const cancelled = counts.cancelled; // new status for cancelled connections

    // 8) Calculate totalSent to include both invited and accepted connections
    // This ensures we count all connections that were ever sent, even if they're now accepted
    const totalSent =
      counts.invited +
      counts.connected +
      counts.followup_message_send +
      counts.second_followup_message_send;

    // 9) rates & daily average
    const acceptanceRate = totalSent ? (accepted / totalSent) * 100 : 0;

    // 10) total messages needs to be calculated using all connections counting if follow_up_sent_at, and second_follow_up_sent_at exists, count it as 2 messages
    const { data: connections, error: connErr } = await supabase
      .from("linkedin_connections")
      .select(
        "follow_up_sent_at, second_follow_up_sent_at, reply_received_at, connection_note_sent_at",
      )
      .in("campaign_id", campaignIds);

    if (connErr) {
      console.error("Connections fetch error:", connErr);
      return NextResponse.json({ error: "Failed to load connections" }, { status: 500 });
    }

    // 10) weekly data (last 7 days of follow‐ups)
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
      .in("campaign_id", campaignIds)
      .not("reply_received_at", "is", null);
    if (replErr) {
      console.error("Replies count error:", replErr);
      return NextResponse.json({ error: "Failed to load replies count" }, { status: 500 });
    }

    const { count: messaged = 0, error: msgdErr } = await supabase
      .from("linkedin_connections")
      .select("id", { head: true, count: "exact" })
      .in("campaign_id", campaignIds)
      .or(
        "connection_note_sent_at.not.is.null,follow_up_sent_at.not.is.null,second_follow_up_sent_at.not.is.null",
      );
    if (msgdErr) {
      console.error("Messaged count error:", msgdErr);
      return NextResponse.json({ error: "Failed to load messaged count" }, { status: 500 });
    }

    // --- response rate
    const responseRate = messaged ? ((replied || 0) / messaged) * 100 : 0;

    // 12) Calculate daily average and weekly growth
    const dailyAverage = campaigns.length > 0 ? Math.round(totalSent / Math.max(1, campaigns.length)) : 0;
    const weeklyGrowth = Math.round(accepted / Math.max(1, campaigns.length));

    // 13) return payload with REAL data
    return NextResponse.json({
      totalImported, // Real imported profiles
      totalSent, // Real sent connection requests
      accepted,
      cancelled,
      pending,
      totalMessages,
      acceptanceRate,
      responseRate,
      dailyAverage,
      weeklyGrowth,
      weeklyData: Array(7).fill(0), // Placeholder for now
    });
  } catch (err: any) {
    console.error("Metrics route unexpected error:", err);
    return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
  }
}
