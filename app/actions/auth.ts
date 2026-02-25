"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

const ensureLinkedInSettings = async (userId: string, supabase: any) => {
  // Use upsert to handle race conditions and avoid duplicate key errors
  const { error: upsertError } = await supabase.from("linkedin_settings").upsert(
    {
      user_id: userId,
      max_message_per_day: 50,
      max_connections_per_day: 30,
      total_visits_per_day: 100,
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true,
    },
  );

  if (upsertError) {
    console.error("Error upserting default LinkedIn settings:", upsertError.message);
  }
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const referralCode = formData.get("referralCode")?.toString();



  // Test Supabase connection
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("count").single();
    if (error && error.code !== "PGRST116") {
      console.error("Database connection error:", error.message);
      return { error: "Unable to connect to the database. Please try again later." };
    }
  } catch (e) {
    console.error("Database connection error:", e);
    return { error: "Unable to connect to the database. Please try again later." };
  }

  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // First, check if a profile already exists for this email
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking existing profile:", profileError.message);
      return { error: "Error checking existing profile" };
    }

    if (existingProfile) {
      return { error: "This email may already be in use" };
    }

    // Set trial_weeks based on referral code
    // If ref contains "2WK", set to 2 weeks (14 days)
    // If ref contains "YC", set to 8 weeks
    // Default to 1 week for all other cases
    let trialWeeks = 1;
    if (referralCode) {
      const upperReferralCode = referralCode.toUpperCase();
      if (upperReferralCode.includes("2WK")) {
        trialWeeks = 2;
      } else if (upperReferralCode.includes("YC")) {
        trialWeeks = 8;
      }
    }


    // Attempt to sign up the user with metadata including trial_weeks
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          trial_weeks: trialWeeks,
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error.message);
      return { error: "Failed to create account. Please try again." };
    }

    if (!data?.user) {
      console.error("No user data returned from signup");
      return { error: "Failed to create user" };
    }

    if (data.user?.identities?.length === 0) {
      return { error: "This email may already be in use" };
    }

    // Wait a moment for the database trigger to create the profile with the metadata
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Sign up successful! Please check your email.",
      data: { email },
    };
  } catch (error) {
    console.error(
      "Unexpected error during sign up:",
      error instanceof Error ? error.message : error,
    );
    return { error: "An unexpected error occurred during sign up" };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const referer = (await headers()).get("referer") || "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Check if this is an operator login attempt
  const isOperatorLogin = referer.includes("operator-login");

  if (isOperatorLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return { error: "Invalid email or password" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      await ensureLinkedInSettings(user.id, supabase);
    }

    return {
      success: true,
      message: "Sign in successful!",
    };
  }

  // Standard Client Portal: Always make the auth call (dummy call),
  // but always return invalid regardless of the actual result.
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error: "Invalid email or password" };
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return { error: "Failed to send reset email. Please try again." };
  }

  return {
    success: true,
    message: "Check your email for a link to reset your password.",
  };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Password and confirm password are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error(error.message);
    return { error: "Failed to reset password. Please try again." };
  }

  return {
    success: true,
    message: "Password has been reset successfully.",
  };
};

export const verifyOtpAction = async (formData: FormData) => {
  const otp = formData.get("otp")?.toString();
  const email = formData.get("email")?.toString();
  const supabase = await createClient();

  if (!otp || !email) {
    return { error: "OTP and email are required" };
  }

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    console.error(error.message);
    return { error: "Invalid verification code. Please try again." };
  }

  // Initialize LinkedIn settings after successful OTP verification
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) {
    await ensureLinkedInSettings(user.id, supabase);
  }

  return {
    success: true,
    message: "Account created successfully",
    data: { email },
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signOutUser = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};

export const isUserAuthenticated = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      await ensureLinkedInSettings(user.id, supabase);
    }

    return user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
};
