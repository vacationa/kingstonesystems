import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Отримуємо поточний статус з БД
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("has_sales_navigator")
      .eq("id", userId)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // Якщо вже підтверджено - повертаємо true
    if (profile.has_sales_navigator === true) {
      return NextResponse.json({
        hasAccess: true,
        cached: true,
      });
    }

    // Якщо false - потрібно перевірити через Puppeteer
    // Викликаємо backend API для перевірки
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL ||
      process.env.SOCKET_API_BASE_URL ||
      "http://localhost:3008";

    console.log("🔍 Checking Sales Navigator access for user:", userId);
    console.log("🌐 Backend URL:", backendUrl);

    const backendResponse = await fetch(`${backendUrl}/api/sales-navigator/check-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!backendResponse.ok) {
      console.error(
        "❌ Backend response not OK:",
        backendResponse.status,
        backendResponse.statusText,
      );
      return NextResponse.json(
        { error: "Failed to check Sales Navigator access" },
        { status: 500 },
      );
    }

    const { hasAccess } = await backendResponse.json();
    console.log("✅ Sales Navigator access result:", hasAccess);

    // Оновлюємо статус в БД
    await supabase.from("profiles").update({ has_sales_navigator: hasAccess }).eq("id", userId);

    return NextResponse.json({
      hasAccess,
      cached: false,
    });
  } catch (error) {
    console.error("Error checking Sales Navigator access:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
