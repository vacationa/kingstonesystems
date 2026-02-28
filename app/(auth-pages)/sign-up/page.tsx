"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { signUpAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { aeonik } from "../../fonts/fonts";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  partnerCode: z.string().min(1, "Partner code is required"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<{ error?: string; success?: string }>({});
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setFormState({});

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("partnerCode", data.partnerCode);

      // Check for referral code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) formData.append("referralCode", ref);

      const result = await signUpAction(formData);

      if ("error" in result && result.error) {
        setFormState({ error: result.error });
        return;
      }

      if (result.success) {
        setFormState({ success: result.message });
        // Redirect to OTP verification
        router.push(`/otp?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 bg-slate-50 min-h-screen relative overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(30,64,175,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/assets/newlogo.png" alt="Kingstone Systems" className="h-10 w-auto rounded-md border border-slate-200 shadow-sm" />
            <span className="text-[17px] font-medium text-slate-900 font-[family-name:var(--font-figtree)]">Kingstone Systems</span>
          </Link>
          <h1
            className={` text-2xl md:text-3xl font-bold text-slate-900 mb-2`}
          >
            Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Registration</span>
          </h1>
          <p className={` font-light text-slate-500 text-base`}>
            Create your internal account to access the mission control dashboard.
          </p>
        </div>

        <Card className="border border-slate-200 bg-white rounded-3xl text-slate-900 shadow-sm">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="firstName"
                    className={`text-sm  text-slate-700 font-semibold`}
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    className="text-sm bg-slate-50 h-11 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 text-slate-900 placeholder:text-slate-400 shadow-none"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <span className={`text-xs text-red-500 `}>
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lastName"
                    className={`text-sm  text-slate-700 font-semibold`}
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    className="text-sm bg-slate-50 h-11 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 text-slate-900 placeholder:text-slate-400 shadow-none"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className={`text-xs text-red-500 `}>
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className={`text-sm  text-slate-700 font-semibold`}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-sm bg-slate-50 h-11 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 text-slate-900 placeholder:text-slate-400 shadow-none"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className={`text-xs text-red-500 `}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className={`text-sm  text-slate-700 font-semibold`}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-12 text-sm bg-slate-50 h-11 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 text-slate-900 placeholder:text-slate-400 shadow-none"
                    placeholder="Min. 6 characters"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 px-3 h-full hover:bg-transparent"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <span className={`text-xs text-red-500 `}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="partnerCode"
                  className={`text-sm  text-slate-700 font-semibold`}
                >
                  Partner Code
                </Label>
                <Input
                  id="partnerCode"
                  type="text"
                  className="text-sm bg-slate-50 h-11 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 text-slate-900 placeholder:text-slate-400 shadow-none"
                  placeholder="Enter partner code"
                  {...register("partnerCode")}
                />
                {errors.partnerCode && (
                  <span className={`text-xs text-red-500 `}>
                    {errors.partnerCode.message}
                  </span>
                )}
              </div>

              {(formState.error || formState.success || errors.root) && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage
                    message={{
                      error: formState.error || errors.root?.message,
                      success: formState.success,
                    }}
                  />
                </div>
              )}

              <SubmitButton
                pendingText="Creating partner account..."
                disabled={isSubmitting}
                className={`h-11 mt-2 text-sm  bg-blue-700 text-white hover:bg-blue-800 rounded-xl transition-all duration-300 font-semibold shadow-sm`}
              >
                Create Partner Account
              </SubmitButton>

              <p className={`text-center text-sm  text-slate-600 mt-2`}>
                Already have an account?{" "}
                <Link href="/partner-login" className="text-blue-700 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-blue-700 transition-colors"
          >
            ← Back to kingstonesystems.com
          </Link>
        </p>
      </div>
    </div>
  );
}
