import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    // Simulate server-side processing time (looks real in the network tab)
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 300));

    // Basic presence check — always deny
    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required.", code: "MISSING_FIELDS" },
            { status: 400 }
        );
    }

    // Always return 401 — credentials never match
    return NextResponse.json(
        {
            error: "Invalid credentials.",
            code: "INVALID_CREDENTIALS",
            hint: "Check your email and password and try again.",
        },
        { status: 401 }
    );
}
