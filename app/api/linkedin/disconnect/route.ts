import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/database.types";
export const maxDuration = 59; // timeout: 59 seconds
/**
 * DELETE handler for removing LinkedIn account connections from Supabase
 *
 * Removes the user's LinkedIn account record from the linkedin_accounts table
 */
import { createClient } from "@/lib/supabase/server"; // Adjust this path as per your project setup

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset linkedin_connected = false in profiles table
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({ linkedin_connected: false })
      .eq("id", user.id as any);

    // Check if the user has a LinkedIn account connected
    const { data: existingAccount, error: fetchError } = await supabase
      .from("linkedin_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching existing account:", fetchError);
      return NextResponse.json({ error: "Failed to check existing account" }, { status: 500 });
    }

    // If there's nothing to delete, just return success
    if (!existingAccount) {
      return NextResponse.json({
        success: true,
        message: "LinkedIn account disconnected successfully",
      });
    }

    if (existingAccount) {
      const backendUrl =
        process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL ||
        process.env.SOCKET_API_BASE_URL ||
        "http://localhost:3008";
      // Clear Redis block before deleting account
      try {
        const response = await fetch(
          `${backendUrl}/limits/clear-weekly-block/${existingAccount.id}`,
          {
            method: "POST",
          },
        );
        if (!response.ok) {
          console.warn("Failed to clear weekly invite block:", await response.text());
        }
      } catch (error) {
        console.error("Error clearing weekly invite block:", error);
      }
    }

    // Delete the LinkedIn account
    const { error: deleteError } = await supabase
      .from("linkedin_accounts")
      .delete()
      .eq("user_id", user.id as any);

    if (deleteError) {
      console.error("Error deleting LinkedIn account:", deleteError);
      return NextResponse.json(
        {
          error: `Failed to disconnect LinkedIn account: ${deleteError.message}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "LinkedIn account disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting LinkedIn account:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
