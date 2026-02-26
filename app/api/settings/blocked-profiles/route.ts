import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/** Витягуємо канонічний slug з будь-якого LinkedIn-профіль URL */
function extractLinkedInSlug(raw: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    const hostOk = /(^|\.)linkedin\.com$/i.test(u.hostname.replace(/^www\./i, ""));
    if (!hostOk) return null;
    const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    // очікуємо /in/<slug>
    const i = parts.findIndex((p) => p.toLowerCase() === "in");
    if (i === -1 || !parts[i + 1]) return null;
    const slug = parts[i + 1].toLowerCase();
    // простенька перевірка, щоб не зловити company/school
    if (slug === "company" || slug === "school" || slug === "groups") return null;
    return slug;
  } catch {
    return null;
  }
}

/** Нормалізуємо URL до канонічного виду */
function canonicalProfileUrl(raw: string): string | null {
  const slug = extractLinkedInSlug(raw);
  return slug ? `https://www.linkedin.com/in/${slug}` : null;
}

// GET — список заблокованих URL (для фронта повертаємо саме URL)
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("linkedin_blocked_profiles")
      .select("profile_url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blocked profiles:", error);
      return NextResponse.json({ error: "Failed to fetch blocked profiles" }, { status: 500 });
    }

    const blockedUrls = (data ?? []).map((r) => r.profile_url);
    return NextResponse.json({ blockedUrls });
  } catch (error) {
    console.error("Unexpected error in GET /api/settings/blocked-profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — додати в blacklist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profileUrl } = await request.json();
    if (!profileUrl || typeof profileUrl !== "string") {
      return NextResponse.json({ error: "Profile URL is required" }, { status: 400 });
    }

    const canonicalUrl = canonicalProfileUrl(profileUrl);
    const slug = extractLinkedInSlug(profileUrl);
    if (!canonicalUrl || !slug) {
      return NextResponse.json({ error: "Invalid LinkedIn profile URL" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("linkedin_blocked_profiles")
      .insert({
        user_id: user.id,
        profile_url: canonicalUrl,
      })
      .select("id, profile_url, created_at")
      .single();

    if (error) {
      // 23505 — unique_violation (user_id, slug)
      if ((error as any).code === "23505") {
        return NextResponse.json({ error: "This profile is already blocked" }, { status: 409 });
      }
      console.error("Error adding blocked profile:", error);
      return NextResponse.json({ error: "Failed to add blocked profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, blockedProfile: data });
  } catch (error) {
    console.error("Unexpected error in POST /api/settings/blocked-profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — прибрати з blacklist (видаляємо по slug, щоб спрацювали будь-які варіанти URL)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const profileUrl = searchParams.get("profileUrl");
    if (!profileUrl) {
      return NextResponse.json({ error: "Profile URL is required" }, { status: 400 });
    }

    const slug = extractLinkedInSlug(profileUrl);
    if (!slug) {
      return NextResponse.json({ error: "Invalid LinkedIn profile URL" }, { status: 400 });
    }

    // Видаляємо по (user_id, slug) — це надійніше, ніж точний текст URL
    const { error } = await supabase
      .from("linkedin_blocked_profiles")
      .delete()
      .eq("user_id", user.id)
      .eq("slug", slug);

    if (error) {
      console.error("Error removing blocked profile:", error);
      return NextResponse.json({ error: "Failed to remove blocked profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/settings/blocked-profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
