import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { referralSource, referralSourceDetail } = body;

    if (!referralSource) {
      return NextResponse.json(
        { error: "Referral source is required" },
        { status: 400 }
      );
    }

    // Update the user's profile with referral source
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        referral_source: referralSource,
        referral_source_detail: referralSourceDetail || null,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating referral source:", updateError);
      return NextResponse.json(
        { error: "Failed to save referral source" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in referral source API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

