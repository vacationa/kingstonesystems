import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { computeStats } from "@/lib/stats/campaignStats";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { searchParams } = new URL(req.url);

  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Get current user (dashboard / internal usage)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ campaigns: [], count: 0 });
  }

  const {
    data: campaigns,
    error: campaignError,
    count,
  } = await supabase
    .from("linkedin_campaigns")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (campaignError || !campaigns) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }

  const campaignIds = campaigns.map((c) => c.id);

  const { data: connections, error: connError } = await supabase
    .from("linkedin_connections")
    .select("campaign_id, status")
    .in("campaign_id", campaignIds);

  if (connError) {
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }

  const statsMap = computeStats(connections || []);

  const campaignsWithStats = campaigns.map((c) => {
    const stats = statsMap[c.id] || { sent: 0, accepted: 0, invited: 0, cancelled: 0 };
    const responseRate =
      stats.sent > 0 ? Math.round((stats.accepted / stats.sent) * 100 * 10) / 10 : 0;

    return {
      ...c,
      // Map connection_note to connection_message for frontend compatibility
      connection_message: (c as any).connection_note ?? c.connection_message,
      sent: stats.sent,
      accepted: stats.accepted,
      invited: stats.invited,
      cancelled: stats.cancelled,
      responseRate,
    };
  });

  return NextResponse.json({ campaigns: campaignsWithStats, count });
}

/**
 * POST /api/campaigns
 *
 * External API for creating campaigns.
 * - Auth: header `x-api-key` must equal `EXTERNAL_CAMPAIGN_API_KEY` env var
 * - Uses Supabase service role to bypass RLS and associate with provided userId
 */
export async function POST(req: NextRequest) {
  try {
    const apiKeyHeader = req.headers.get("x-api-key");
    const expectedKey = process.env.EXTERNAL_CAMPAIGN_API_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { error: "External campaign API key is not configured" },
        { status: 500 },
      );
    }

    if (!apiKeyHeader || apiKeyHeader !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      userId,
      name,
      linkedinUrl,
      connectionMessage = null,
      followUpMessage = null,
      followUpDays = 0,
      dailyLimit = 25,
      totalProfiles = null,
      processedProfiles = 0,
      status = "queued",
      statusMessage = null,
    } = body ?? {};

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    if (!linkedinUrl || typeof linkedinUrl !== "string") {
      return NextResponse.json({ error: "linkedinUrl is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase service role is not configured" },
        { status: 500 },
      );
    }

    const supabase = createServerClient<Database>(supabaseUrl, serviceKey, {
      cookies: {
        get() {
          return "";
        },
        set() {
          /* no-op */
        },
        remove() {
          /* no-op */
        },
      },
    });

    const { data: campaign, error } = await supabase
      .from("linkedin_campaigns")
      .insert({
        user_id: userId,
        name,
        linkedin_url: linkedinUrl,
        connection_message: connectionMessage,
        follow_up_message: followUpMessage,
        follow_up_days: followUpDays,
        daily_limit: dailyLimit,
        total_profiles: totalProfiles,
        processed_profiles: processedProfiles,
        status,
        status_message: statusMessage,
      } as Database["public"]["Tables"]["linkedin_campaigns"]["Insert"])
      .select()
      .single();

    if (error || !campaign) {
      return NextResponse.json(
        { error: "Failed to create campaign", details: error?.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        campaign,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message },
      { status: 500 },
    );
  }
}
