import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const TRIAL_DAYS = 14;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await import("@/lib/supabase/server").then((m) => m.createClient(cookieStore));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ daysRemaining: 0, error: "User not found" }, { status: 404 });
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("created_at, partner_status")
      .eq("id", user.id)
      .single();

    const profile = profileData as { created_at: string; partner_status: string | null } | null;

    if (profileError || !profile?.created_at) {
      return NextResponse.json({ daysRemaining: 0, error: "Profile not found" }, { status: 404 });
    }

    // Platinum members have unlimited access — no trial countdown
    const isPlatinum = !!profile.partner_status?.toLowerCase().includes("platinum");
    if (isPlatinum) {
      return NextResponse.json({ subscribed: true, isPlatinum: true, daysRemaining: null });
    }

    // Everyone else (Silver free members) gets a 14-day trial
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceSignup = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysRemaining = Math.max(0, TRIAL_DAYS - daysSinceSignup);

    return NextResponse.json({
      daysRemaining,
      isPlatinum: false,
      subscribed: daysRemaining > 0,
    });
  } catch (error) {
    return NextResponse.json({ daysRemaining: 0, error: "Internal server error" }, { status: 500 });
  }
}
