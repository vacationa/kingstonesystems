import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Get total count for pagination
  const { count, error: countError } = await supabase
    .from("linkedin_connections")
    .select("*", { head: true, count: "exact" })
    .eq("campaign_id", campaignId);

  if (countError) {
    return NextResponse.json({ error: "Failed to fetch connections count" }, { status: 500 });
  }

  // Fetch paginated data
  const { data, error } = await supabase
    .from("linkedin_connections")
    .select("*")
    .eq("campaign_id", campaignId)
    .range(offset, offset + limit - 1)
    .order("requested_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return NextResponse.json({ 
    data, 
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }, { status: 200 });
}
