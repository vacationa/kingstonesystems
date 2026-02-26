import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "http://localhost:3008";

    // Get the request body to forward userId
    const body = await request.json();

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/limits/skip-warmup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward any authorization headers if needed
        ...(request.headers.get("authorization") && {
          authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body), // Forward the body with userId
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return NextResponse.json({ error: "Failed to skip warmup" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Skip warmup error:", error);

    // Check if it's a connection error
    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Backend server is not running. Please start the backend server." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
