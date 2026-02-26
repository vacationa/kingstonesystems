// app/api/scale/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export const maxDuration = 59; // Route timeout: 59 s

interface CsvRow {
  // Adjust these keys if your frontend sends different names
  linkedin_url?: string;
  profile_url?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  current_company?: string;
  headline?: string;
}

export async function POST(request: NextRequest) {
  try {
    /* ────────────────────────
       Auth
    ──────────────────────── */
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("Unauthorized");

    /* ────────────────────────
       Parse & validate payload
    ──────────────────────── */
    const payload = await request.json();
    const {
      name,
      linkedinUrl,
      connectionMessage,
      followUpMessage,
      secondFollowUpMessage,
      connectionMessageEnabled,
      followUpEnabled,
      secondFollowUpEnabled,
      followUpDays,
      followUpHours,
      secondFollowUpDays,
      secondFollowUpHours,
      dailyLimit,
      weeklyLimit,
      importLimit,
      startDate,
      endDate,
      startTime,
      endTime,
      hasEndDate,
      isPaidUser,
      campaign_type,
      rows = [], //  ← CSV rows come in here
    }: {
      /* keep everything as-is, but hint rows */
      rows?: CsvRow[];
      [k: string]: any;
    } = payload;

    // Limit check for free users - COMMENTED OUT
    // if (!isPaidUser && importLimit > 500) {
    //   return NextResponse.json(
    //     { success: false, error: "Free users can only import up to 500 contacts" },
    //     { status: 400 },
    //   );
    // }

    /* ────────────────────────
       Create campaign
    ──────────────────────── */
    const start = new Date(startDate);
    const end = hasEndDate ? new Date(endDate) : null;
    let processed_profiles = 0;
    if (campaign_type === "csv") {
      processed_profiles = rows.filter((r: CsvRow) => {
        const url = (r.linkedin_url || r.profile_url || "").trim();
        return url.length > 0;
      }).length;
    }

    const { data: camp, error: campErr } = await supabase
      .from("linkedin_campaigns")
      .insert({
        user_id: user.id,
        name,
        linkedin_url: linkedinUrl,
        status: "queued",
        status_message: null,
        processed_profiles: processed_profiles,
        total_profiles: importLimit,
        start_date: start,
        end_date: end,
        connection_note: connectionMessage,
        follow_up_message: followUpMessage,
        second_follow_up_message: secondFollowUpMessage,
        follow_up_days: followUpDays,
        follow_up_hours: followUpHours,
        second_follow_up_days: secondFollowUpDays,
        second_follow_up_hours: secondFollowUpHours,
        campaign_type,
      })
      .select()
      .single();

    if (campErr || !camp) throw campErr || new Error("Failed to create campaign");

    /* ────────────────────────
       Trigger profile collection for ALL campaigns including CSV
    ──────────────────────── */
    // Trigger immediate profile collection for all campaign types
    try {
      const automationServiceUrl =
        process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "http://localhost:3008";
      // console.log(
      //   `📤 Attempting to start profile collection for ${campaign_type} campaign ${camp.id} at: ${automationServiceUrl}`,
      // );

      const response = await fetch(`${automationServiceUrl}/api/jobs/collect-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          campaignId: camp.id,
          sourceUrl: linkedinUrl,
          limit: importLimit,
          campaignType: campaign_type,
          // Додаємо CSV дані для backend обробки
          csvData: campaign_type === "csv" ? rows : undefined,
        }),
      });

      // if (response.ok) {
      //   console.log(
      //     `✅ Profile collection started immediately for ${campaign_type} campaign: ${camp.id}`,
      //   );
      // } else {
      //   console.warn(`⚠️ Failed to start profile collection (HTTP ${response.status})`);
      // }
    } catch (error: any) {
      // More specific error handling
      // if (error?.code === "ECONNREFUSED") {
      //   console.warn(`⚠️ Automation service not available - profile collection failed`);
      // } else {
      //   console.warn(
      //     `⚠️ Could not start profile collection (${error?.message || "Unknown error"}):`,
      //     error?.cause || error?.code || "Network error",
      //   );
      // }
    }

    /* ────────────────────────
       Done
    ──────────────────────── */
    return NextResponse.json({ success: true, campaignId: camp.id });
  } catch (error) {
    //console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
