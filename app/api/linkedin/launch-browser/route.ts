import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const maxDuration = 59;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has LinkedIn access
    const { data } = await supabase
      .from("profiles")
      .select("linkedin_access, created_at")
      .eq("id", user.id)
      .single();

    const profile = data as any;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let hasAccess = profile.linkedin_access === true;

    // If no explicit access, check if within 14 days of account creation
    if (!hasAccess && profile.created_at) {
      const createdAt = new Date(profile.created_at);
      const daysSinceCreation = (new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
      if (daysSinceCreation <= 14) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "LinkedIn tool access expired. Please contact support to restore access." },
        { status: 403 }
      );
    }

    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL ||
      process.env.SOCKET_API_BASE_URL ||
      "http://localhost:3008";

    try {
      const response = await fetch(`${backendUrl}/api/scheduler/trigger/linkedin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const result = await response.json();

      return NextResponse.json({
        success: true,
        sessionId: result.sessionId,
        websocketUrl: `${backendUrl.replace("http", "ws")}`,
        message: "LinkedIn login session started",
      });
    } catch (apiError) {
      console.error("Error calling backend API:", apiError);
      return NextResponse.json(
        { error: "Failed to start LinkedIn login session" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error launching LinkedIn browser:", error);
    return NextResponse.json({ error: "Failed to launch LinkedIn browser" }, { status: 500 });
  }
}
