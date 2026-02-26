import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { SubscriptionsClass } from "@/app/api/repositories/subscriptions";
import { UserRepository } from "@/app/api/repositories/user";
import { cookies } from "next/headers";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = "force-dynamic";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: any;
  };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // console.log("🔔 Stripe Webhook received:", {
  //   signature: signature ? "present" : "missing",
  //   bodyLength: body.length,
  //   timestamp: new Date().toISOString(),
  // });

  let data: StripeEvent["data"];
  let eventType: string;
  let event: StripeEvent;

  // Initialize Supabase client
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret) as StripeEvent;
    //console.log("✅ Webhook signature verified successfully");
  } catch (err: any) {
    //console.error("❌ Invalid webhook signature:", err.message);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  // console.log("📋 Processing event:", {
  //   type: eventType,
  //   eventId: event.id,
  //   timestamp: new Date().toISOString(),
  // });

  try {
    switch (eventType) {
      case "customer.subscription.created": {
        //console.log("🔄 Processing customer.subscription.created event");

        const subscription = event.data.object;
        // console.log("📊 Subscription data:", {
        //   id: subscription.id,
        //   status: subscription.status,
        //   customer: subscription.customer,
        //   plan: subscription.plan,
        //   items: subscription.items?.data?.length || 0,
        // });

        // Fix: Use correct path for price_id in modern Stripe API

        const priceId = subscription.items?.data?.[0]?.price?.id || subscription.plan?.id;
        const customerId = subscription.customer;

        //console.log("💰 Price ID extracted:", priceId);

        const customer = await stripe.customers.retrieve(customerId);
        const userEmail = (customer as any).email;

        // console.log("👤 Customer data:", {
        //   id: customerId,
        //   email: userEmail,
        //   name: (customer as any).name,
        // });

        const interval = subscription.items?.data?.[0]?.price?.recurring?.interval || "month";
        const intervalCount = subscription.items?.data?.[0]?.price?.recurring?.interval_count || 1;

        // console.log("🔄 Subscription interval data:", {
        //   interval,
        //   intervalCount,
        // });

        // console.log("🔧 Calling createUserSubscription RPC with params:", {
        //   p_email: userEmail,
        //   p_price_id: priceId,
        //   p_customer_id: customerId,
        //   p_subscription_id: subscription.id,
        //   p_interval: interval,
        //   p_interval_count: intervalCount,
        // });

        const { data: userExist, error: userExistError } = await supabase.rpc(
          "createUserSubscription",
          {
            p_email: userEmail,
            p_customer_id: customerId,
            p_price_id: priceId,
            p_subscription_id: subscription.id,
            p_interval: interval,
            p_interval_count: intervalCount,
          },
        );

        // console.log("📝 RPC Result:", {
        //   userExist,
        //   error: userExistError,
        //   success: !userExistError,
        // });

        if (!userExistError) {
          //console.log("✅ Subscription created successfully, sending welcome email");
          try {
            await resend.emails.send({
              from: "Tiger <info@icptiger.com>",
              to: [(customer as any).email],
              subject: "Welcome to Tiger! 🎉",
              html: `
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #ffffff; padding: 40px 20px; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <tr>
                    <td align="center" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: white; border: 1px solid #e5e7eb; border-radius: 12px;">
                        <tr>
                          <td style="padding: 48px 40px 40px 40px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                              <h1 style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 700; color: #000000; margin: 0 0 12px 0; line-height: 1.2;">
                                Welcome to <span style="color: #0A66C2;">Tiger</span> 🎉
                              </h1>
                            </div>
                            
                            <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">Hi there,</p>
                            
                            <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                              Thanks for joining Tiger! We're excited to have you on board. Your subscription is now active and ready to help you build your LinkedIn pipeline.
                            </p>
                            
                            <p style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 32px 0;">
                              You build the business, Tiger builds the pipeline.
                            </p>
                            
                            <div style="text-align: center; margin: 40px 0;">
                              <a href=${
                                !userExist
                                  ? `${process.env.NEXT_PUBLIC_URL}sign-up?email=` +
                                    (customer as any).email
                                  : `${process.env.NEXT_PUBLIC_URL}dashboard`
                              }
                                style="display: inline-block; background-color: transparent; color: #0A66C2; padding: 14px 32px; text-decoration: none; border-radius: 12px; border: 2px solid #0A66C2; font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 500;">
                                ${!userExist ? "Create account now →" : "Go to dashboard →"}
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
                              Best,<br><br>
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
            console.log("📧 Welcome email sent successfully");
          } catch (emailError) {
            console.error("❌ Failed to send welcome email:", emailError);
          }
        } else {
          console.error("❌ Failed to create user subscription:", userExistError);
        }
        break;
      }

      case "customer.subscription.updated": {
        //console.log("🔄 Processing customer.subscription.updated event");
        const subscription = data.object;
        const previousAttributes = (data as any).previous_attributes;

        // console.log("📊 Subscription update data:", {
        //   id: subscription.id,
        //   status: subscription.status,
        //   previousStatus: previousAttributes?.status,
        //   customer: subscription.customer,
        // });

        if (previousAttributes.status === "trialing" && subscription.status === "past_due") {
          //console.log("⚠️ Cancelling subscription due to past_due status");
          await stripe.subscriptions.cancel(subscription.id);
          //console.log("✅ Subscription cancelled successfully");
        }
        break;
      }

      case "customer.subscription.deleted": {
        //console.log("🔄 Processing customer.subscription.deleted event");
        const subscription = await stripe.subscriptions.retrieve(data.object.id);
        // console.log("📊 Deleted subscription data:", {
        //   id: subscription.id,
        //   customer: subscription.customer,
        //   status: subscription.status,
        // });

        const subscriptionsRepo = new SubscriptionsClass();
        const userData = await subscriptionsRepo.getUserByCustomerId(
          subscription.customer as string,
        );

        // console.log("👤 User data for revocation:", {
        //   userId: userData?.userId,
        //   email: userData?.email,
        //   found: !!(userData?.userId && userData?.email),
        // });

        // Перевірити чи знайдено користувача
        if (!userData?.userId) {
          //console.log("⚠️ User not found for customer ID:", subscription.customer);
          return NextResponse.json({ received: true });
        }

        const response = await supabase.rpc("revokeUserSubscription", {
          user_id_input: userData.userId,
        });

        // console.log("📝 Revoke RPC Result:", {
        //   error: response.error,
        //   success: !response.error,
        // });

        if (!response.error) {
          //console.log("✅ Subscription revoked successfully, sending deactivation email");
          try {
            await resend.emails.send({
              from: "icptiger <info@icptiger.com>",
              to: [userData.email!],
              subject: "Your icptiger Subscription Status",
              html: `
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8fafc; padding: 40px 20px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <tr>
                    <td align="center" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <tr>
                          <td style="padding: 40px 32px 32px 32px;">
                            <div style="text-align: center; margin-bottom: 32px;">
                              <h1 style="font-family: 'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">Subscription Deactivated</h1>
                              <div style="width: 60px; height: 3px; background-color: #0A66C2; margin: 0 auto; border-radius: 2px;"></div>
                            </div>
                            
                            <p style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">Hi there,</p>
                            
                            <p style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                              We wanted to let you know that your icptiger subscription has been deactivated.
                            </p>
                            
                            <p style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                              You can reactivate your subscription anytime through your dashboard. We'll miss you! If you have any feedback, we'd love to hear it.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                              <a href="${process.env.NEXT_PUBLIC_URL}dashboard" style="display: inline-block; background-color: #0A66C2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; transition: background-color 0.2s ease;">Reactivate Subscription</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 32px 40px 32px; border-top: 1px solid #e2e8f0;">
                            <p style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #64748b; margin: 20px 0 0 0;">
                              Best,<br>
                              <span style="font-weight: 500; color: #0A66C2;">The icptiger Team</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              `,
            });
            console.log("📧 Deactivation email sent successfully");
          } catch (emailError) {
            console.error("❌ Failed to send deactivation email:", emailError);
          }
        } else {
          console.error("❌ Failed to revoke user subscription:", response.error);
        }
        break;
      }

      default:
        console.log("⚠️ Unhandled event type:", eventType);
      // Unhandled event type
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  console.log("✅ Webhook processed successfully");
  return NextResponse.json({ received: true });
}
