import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { searchParams } = new URL(req.url);

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User authentication error:", userError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const jobTypes = searchParams.getAll("job_type");
  const campaignId = searchParams.get("campaign_id");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const before = searchParams.get("before"); // ISO string cursor (created_at) - for backward compatibility

  // Build base query
  let baseQuery = supabase
    .from("linkedin_logs")
    .select("id, campaign_id, job_type, log_level, message, created_at, context", { count: "exact" })
    .eq("user_id", user.id)
    .eq("log_level", "info")
    .order("created_at", { ascending: false });

  if (jobTypes.length > 0 && !jobTypes.includes("all")) {
    baseQuery = baseQuery.in("job_type", jobTypes);
  }
  if (campaignId) baseQuery = baseQuery.eq("campaign_id", campaignId);

  // Handle pagination - use page-based if page is provided, otherwise cursor-based for backward compatibility
  let query;
  if (before) {
    // Cursor-based pagination (backward compatibility)
    query = baseQuery.lt("created_at", before).limit(limit);
  } else {
    // Page-based pagination
    const offset = (page - 1) * limit;
    query = baseQuery.range(offset, offset + limit - 1);
  }

  const { data: logs, error, count } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });

  // Return response based on pagination type
  if (before) {
    // Cursor-based response (backward compatibility)
    const nextCursor = logs?.length ? logs[logs.length - 1].created_at : null;
    return NextResponse.json({ logs, nextCursor });
  } else {
    // Page-based response
    const total = count || 0;
    return NextResponse.json({ 
      logs, 
      total, 
      page, 
      limit, 
      totalPages: Math.ceil(total / limit) 
    });
  }
}
