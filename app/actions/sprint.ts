"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// ─── Load all progress for user ────────────────────────────────────────────

export async function loadSprintProgress() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { checked: {}, prizes: {} };

    // Load checkbox states
    const { data: progress } = await supabase
        .from("sprint_progress")
        .select("task_id, checked")
        .eq("user_id", user.id);

    const checked: Record<string, boolean> = {};
    if (progress) {
        for (const row of progress) {
            if (row.checked) checked[row.task_id] = true;
        }
    }

    // Load prize unlocks
    const { data: unlocks } = await supabase
        .from("sprint_prize_unlocks")
        .select("day")
        .eq("user_id", user.id);

    const prizes: Record<number, boolean> = {};
    if (unlocks) {
        for (const row of unlocks) {
            prizes[row.day] = true;
        }
    }

    return { checked, prizes };
}

// ─── Toggle a task checkbox ────────────────────────────────────────────────

export async function toggleTask(taskId: string, checked: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Upsert the progress row
    const { error } = await supabase
        .from("sprint_progress")
        .upsert(
            {
                user_id: user.id,
                task_id: taskId,
                checked,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,task_id" }
        );

    if (error) {
        console.error("Error saving sprint progress:", error.message);
        return { error: error.message };
    }

    // Audit log
    await supabase.from("sprint_audit_log").insert({
        user_id: user.id,
        action: checked ? "task_checked" : "task_unchecked",
        payload: { task_id: taskId, checked, timestamp: new Date().toISOString() },
        ip_address: ip,
    });

    return { success: true };
}

// ─── Unlock a day's prize ──────────────────────────────────────────────────

export async function unlockPrize(day: number, code: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Validate code based on day
    const codes: Record<number, string> = {
        1: "NOTIONPARTNER26",
        2: "KINGSTONEGPT",
        3: "AUDIT",
        4: "15K",
        5: "SILVERPARTNER"
    };

    const expectedCode = codes[day];
    if (!expectedCode || code.trim().toUpperCase() !== expectedCode) {
        return { error: `Invalid unlock code for Day ${day}` };
    }

    // Check if already unlocked
    const { data: existing } = await supabase
        .from("sprint_prize_unlocks")
        .select("id")
        .eq("user_id", user.id)
        .eq("day", day)
        .single();

    if (existing) {
        return { success: true, alreadyUnlocked: true };
    }

    // Insert the unlock
    const { error } = await supabase
        .from("sprint_prize_unlocks")
        .insert({
            user_id: user.id,
            day,
            unlock_code: code.toUpperCase(),
            unlocked_at: new Date().toISOString(),
        });

    if (error) {
        console.error("Error unlocking prize:", error.message);
        return { error: error.message };
    }

    // Audit log
    await supabase.from("sprint_audit_log").insert({
        user_id: user.id,
        action: "prize_unlock_attempt",
        payload: {
            day,
            code: code.toUpperCase(),
            success: true,
            timestamp: new Date().toISOString(),
        },
        ip_address: ip,
    });

    return { success: true };
}

// ─── Submit Day 3 Social Media Audit Request ───────────────────────────────

export async function submitAuditRequest(linkedinUrl: string, instagramUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    const { error } = await supabase.from("sprint_audit_log").insert({
        user_id: user.id,
        action: "social_media_audit_request",
        payload: {
            linkedin_url: linkedinUrl,
            instagram_url: instagramUrl,
            timestamp: new Date().toISOString(),
        },
        ip_address: ip,
    });

    if (error) {
        console.error("Error submitting audit request:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

// ─── Submit Kingstone Silver Certification Request ─────────────────────────

export async function submitCertificationRequest(website: string, name: string, email: string, skoolName: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Check if already active
    const { data: profile } = await supabase
        .from("profiles")
        .select("partner_status")
        .eq("id", user.id)
        .single();
    if (profile?.partner_status === "Active") {
        return { error: "Partner status already activated" };
    }

    const { error } = await supabase.from("sprint_audit_log").insert({
        user_id: user.id,
        action: "silver_certification_request",
        payload: {
            website_name: website,
            contact_name: name,
            contact_email: email,
            skool_name: skoolName,
            timestamp: new Date().toISOString(),
        },
        ip_address: ip,
    });

    const { error: profileError } = await supabase
        .from("profiles")
        .update({ partner_status: "Active" })
        .eq("id", user.id);

    if (error || profileError) {
        console.error("Error submitting certification request:", error?.message || profileError?.message);
        return { error: error?.message || profileError?.message };
    }

    return { success: true };
}

// ─── Get Partner Status ────────────────────────────────────────────────────

export async function getPartnerStatus() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return "Awaiting Activation";

        const { data, error } = await supabase
            .from("profiles")
            .select("partner_status")
            .eq("id", user.id)
            .single();

        if (error || !data || !data.partner_status) {
            return "Awaiting Activation";
        }

        return data.partner_status;
    } catch {
        return "Awaiting Activation";
    }
}
