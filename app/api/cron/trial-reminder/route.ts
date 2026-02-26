import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout

/**
 * Cron job to send trial reminder emails to users with 3 days remaining
 * 
 * Set up in Vercel:
 * 1. Go to your project settings → Cron Jobs
 * 2. Add: /api/cron/trial-reminder
 * 3. Schedule: "0 10 * * *" (runs daily at 10 AM UTC)
 * 
 * Security: Add CRON_SECRET to your environment variables and verify it here
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role for cron jobs (no user session needed)
    const supabase = await createClient();

    // Get all profiles that are not subscribed
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, first_name, created_at, trial_weeks, trial_reminder_sent, trial_reminder_1day_sent");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: "No users to check", sent: 0 });
    }

    const now = new Date();
    const emailsSent: string[] = [];
    const errors: { email: string; error: string }[] = [];

    for (const profile of profiles) {
      try {
        // Check if user is subscribed (skip if they are)
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("id, status")
          .eq("user_id", profile.id)
          .in("status", ["active", "trialing"])
          .maybeSingle();

        if (subscription) {
          // User is subscribed, skip
          continue;
        }

        // Calculate days remaining
        const createdAt = new Date(profile.created_at);
        const daysSinceSignup = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        const trialWeeks = profile.trial_weeks || 1;
        const trialDays = trialWeeks * 7;
        const daysRemaining = trialDays - daysSinceSignup;

        // Send email if exactly 3 days remaining (with some tolerance for timing)
        if (daysRemaining >= 2.5 && daysRemaining <= 3.5) {
          await resend.emails.send({
            from: "Tiger <info@icptiger.com>",
            to: [profile.email],
            subject: "3 days left — keep your pipeline warm",
            html: `
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #ffffff; padding: 40px 20px; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <tr>
                  <td align="center" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: white; border: 1px solid #e5e7eb; border-radius: 12px;">
                      <tr>
                        <td style="padding: 48px 40px 40px 40px;">
                          <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 700; color: #000000; margin: 0 0 12px 0; line-height: 1.2;">
                              Your trial ends in <span style="color: #0A66C2;">3 days</span>
                            </h1>
                          </div>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">Hi ${profile.first_name || "there"},</p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                            Quick heads up, your Tiger trial ends in 3 days. Once it does, your campaigns will pause and momentum slows fast.
                          </p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                            If Tiger has been helping you connect with the right people and get replies, this is a great time to upgrade and lock in your current pricing before future plans go up.
                          </p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 32px 0;">
                            Stay live, keep conversations moving, and don't let your pipeline cool off.
                          </p>
                          
                          <div style="text-align: center; margin: 40px 0;">
                            <a href="${process.env.NEXT_PUBLIC_URL}dashboard"
                              style="display: inline-block; background-color: transparent; color: #0A66C2; padding: 14px 32px; text-decoration: none; border-radius: 12px; border: 2px solid #0A66C2; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 500;">
                              Subscribe to stay active →
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 32px 40px 48px 40px; border-top: 1px solid #e5e7eb;">
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">
                            Have questions? Message <a href="https://www.linkedin.com/in/adhiraj-hangal/" style="color: #0A66C2; text-decoration: none; font-weight: 500;">Adhiraj</a> or <a href="https://www.linkedin.com/in/tarun-jain-75a93b15a/" style="color: #0A66C2; text-decoration: none; font-weight: 500;">Tarun</a> directly on LinkedIn or e-mail <a href="mailto:help@icptiger.com" style="color: #0A66C2; text-decoration: none; font-weight: 500;">help@icptiger.com</a>.
                          </p>
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #6b7280; margin: 24px 0 0 0;">
                            Warmly,<br><br>
                            <span style="font-weight: 600; color: #0A66C2;">The Tiger Team</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `,
          });

          // Mark reminder as sent
          await supabase
            .from("profiles")
            .update({ trial_reminder_sent: now.toISOString() })
            .eq("id", profile.id);

          emailsSent.push(profile.email);
          console.log(`✅ Sent 3-day trial reminder to ${profile.email} (${daysRemaining.toFixed(1)} days remaining)`);
        }

        // Send 1-day reminder if exactly 1 day remaining and not already sent
        if (daysRemaining >= 0.5 && daysRemaining <= 1.5 && !profile.trial_reminder_1day_sent) {
          await resend.emails.send({
            from: "Tiger <info@icptiger.com>",
            to: [profile.email],
            subject: "Last day to stay live on Tiger",
            html: `
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #ffffff; padding: 40px 20px; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <tr>
                  <td align="center" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: white; border: 1px solid #e5e7eb; border-radius: 12px;">
                      <tr>
                        <td style="padding: 48px 40px 40px 40px;">
                          <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 700; color: #000000; margin: 0 0 12px 0; line-height: 1.2;">
                              <span style="color: #0A66C2;">Last day</span> to stay live on Tiger
                            </h1>
                          </div>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">Hi ${profile.first_name || "there"},</p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                            Your Tiger trial ends tomorrow. When it expires, your campaigns will pause and any active outreach will stop.
                          </p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                            If Tiger has been bringing in replies and new conversations, upgrading now lets you stay live and lock in your current pricing before plans increase.
                          </p>
                          
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 32px 0;">
                            Don't lose momentum right before the close.
                          </p>
                          
                          <div style="text-align: center; margin: 40px 0;">
                            <a href="${process.env.NEXT_PUBLIC_URL}dashboard"
                              style="display: inline-block; background-color: transparent; color: #0A66C2; padding: 14px 32px; text-decoration: none; border-radius: 12px; border: 2px solid #0A66C2; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 500;">
                              Upgrade to keep your outreach running →
                            </a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 32px 40px 48px 40px; border-top: 1px solid #e5e7eb;">
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">
                            Have questions? Message <a href="https://www.linkedin.com/in/adhiraj-hangal/" style="color: #0A66C2; text-decoration: none; font-weight: 500;">Adhiraj</a> or <a href="https://www.linkedin.com/in/tarun-jain-75a93b15a/" style="color: #0A66C2; text-decoration: none; font-weight: 500;">Tarun</a> directly on LinkedIn or e-mail <a href="mailto:help@icptiger.com" style="color: #0A66C2; text-decoration: none; font-weight: 500;">help@icptiger.com</a>.
                          </p>
                          <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #6b7280; margin: 24px 0 0 0;">
                            Warmly,<br><br>
                            <span style="font-weight: 600; color: #0A66C2;">The Tiger Team</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `,
          });

          // Mark 1-day reminder as sent
          await supabase
            .from("profiles")
            .update({ trial_reminder_1day_sent: now.toISOString() })
            .eq("id", profile.id);

          emailsSent.push(profile.email);
          console.log(`✅ Sent 1-day trial reminder to ${profile.email} (${daysRemaining.toFixed(1)} days remaining)`);
        }
      } catch (emailError) {
        console.error(`❌ Error sending email to ${profile.email}:`, emailError);
        errors.push({
          email: profile.email,
          error: emailError instanceof Error ? emailError.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Trial reminder check complete`,
      sent: emailsSent.length,
      emails: emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Trial reminder cron error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

