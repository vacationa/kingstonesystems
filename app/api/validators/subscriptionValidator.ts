import { createClient } from "@/lib/supabase/server";

export class SubscriptionValidator {
  static async validateSubscription(subscriptionId: string): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    // Stripe has been removed, returning true by default
    return {
      isValid: true,
    };
  }

  static async checkMonthlyImportLimit(userId: string): Promise<{
    canImport: boolean;
    remainingImports: number;
    error?: string;
  }> {
    try {
      const supabase = await createClient();

      // Get user's subscription status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_period, monthly_imports")
        .eq("id", userId)
        .single();

      // Type assertion for type safety
      const typedProfile = profile as import("@/lib/supabase/database.types").Database["public"]["Tables"]["profiles"]["Row"] | null;

      if (profileError || !typedProfile) {
        return {
          canImport: false,
          remainingImports: 0,
          error: profileError ? profileError.message : "Profile not found"
        };
      }

      // If user has an active subscription, they can import unlimited contacts
      if (typedProfile.subscription_period) {
        return {
          canImport: true,
          remainingImports: -1 // -1 indicates unlimited
        };
      }

      // For free users, check import limit
      const totalImports = typedProfile.monthly_imports ?? 0; // Use nullish coalescing to handle null
      // const importLimit = 500; // COMMENTED OUT - removed 500 import limit
      // const remainingImports = importLimit - totalImports;

      // return {
      //   canImport: remainingImports > 0,
      //   remainingImports,
      //   error: remainingImports <= 0 ? "Import limit reached" : undefined
      // };

      // Allow unlimited imports for free users
      return {
        canImport: true,
        remainingImports: -1, // -1 indicates unlimited
      };
    } catch (error) {
      console.error("Error checking import limit:", error);
      return {
        canImport: false,
        remainingImports: 0,
        error: "Failed to check import limit"
      };
    }
  }

  static async incrementMonthlyImports(userId: string, importCount: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("profiles")
        .update({
          monthly_imports: supabase.rpc('increment_monthly_imports', { increment_by: importCount })
        })
        .eq("id", userId);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update import count"
      };
    }
  }
}
