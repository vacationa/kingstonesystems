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
    <div className="w-full flex flex-col items-center justify-center py-12 bg-[#0F172A] min-h-screen relative overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(30,64,175,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-8">
          <h1
            className={`${aeonik.variable} font-aeonik text-2xl md:text-3xl font-bold text-white mb-2`}
          >
            Operator <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Registration</span>
          </h1>
          <p className={`${aeonik.variable} font-aeonik font-light text-gray-400 text-base`}>
            Create your internal account to access the mission control dashboard.
          </p>
        </div>

        <Card className="border border-[#334155] bg-[#1E293B] rounded-3xl text-white shadow-2xl">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="firstName"
                    className={`text-sm ${aeonik.variable} font-aeonik text-gray-400`}
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    className="text-sm bg-[#0F172A] h-10 rounded-xl border border-[#334155] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <span className={`text-xs text-red-400 ${aeonik.variable} font-aeonik`}>
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lastName"
                    className={`text-sm ${aeonik.variable} font-aeonik text-gray-400`}
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    className="text-sm bg-[#0F172A] h-10 rounded-xl border border-[#334155] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className={`text-xs text-red-400 ${aeonik.variable} font-aeonik`}>
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className={`text-sm ${aeonik.variable} font-aeonik text-gray-400`}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-sm bg-[#0F172A] h-10 rounded-xl border border-[#334155] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className={`text-xs text-red-400 ${aeonik.variable} font-aeonik`}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className={`text-sm ${aeonik.variable} font-aeonik text-gray-400`}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-12 text-sm bg-[#0F172A] h-10 rounded-xl border border-[#334155] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white"
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
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <span className={`text-xs text-red-400 ${aeonik.variable} font-aeonik`}>
                    {errors.password.message}
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
                pendingText="Creating operator account..."
                disabled={isSubmitting}
                className={`h-10 text-sm ${aeonik.variable} font-aeonik bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-blue-900/20`}
              >
                Create Operator Account
              </SubmitButton>

              <p className={`text-center text-sm ${aeonik.variable} font-aeonik text-gray-500`}>
                Already have an account?{" "}
                <Link href="/operator-login" className="text-white hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
