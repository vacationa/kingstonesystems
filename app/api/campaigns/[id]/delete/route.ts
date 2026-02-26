import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      //console.error("No user found in session for DELETE /api/campaigns/[id]/delete");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Перевірити, що кампанія належить користувачу
    const { data: campaign, error: campaignError } = await supabase
      .from("linkedin_campaigns")
      .select("id, user_id, name")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (campaignError || !campaign) {
      //console.error("Campaign not found or access denied:", campaignError);
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // 2. Видалити кампанію (linkedin_connections видаляться автоматично через CASCADE)
    const { error: deleteError } = await supabase
      .from("linkedin_campaigns")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      //console.error("Error deleting campaign:", deleteError);
      return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
    }

    // 3. Скасувати активні завдання в черзі (якщо backend доступний)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "http://localhost:3008";
      await fetch(`${backendUrl}/api/jobs/cancel-campaign/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (backendError) {
      //console.warn("Could not cancel backend jobs:", backendError);
      // Продовжуємо навіть якщо backend недоступний
    }

    //console.log(`Campaign "${campaign.name}" (${id}) deleted successfully by user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: `Campaign "${campaign.name}" deleted successfully`,
    });
  } catch (err) {
    //console.error("Unexpected error in DELETE /api/campaigns/[id]/delete:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
