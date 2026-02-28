"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { forgotPasswordAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { aeonik } from "../../fonts/fonts";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [formState, setFormState] = useState<{ error?: string; success?: string }>({});
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await forgotPasswordAction(formData);

      if ("error" in result) {
        setFormState({ error: result.error });
        return;
      }

      if (result.success) {
        setFormState({ success: result.message });
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-[28rem] px-4">
        <div className="text-center mb-6">
          <h1 className={` text-2xl md:text-3xl font-bold text-white mb-2`}>Reset Password</h1>
          <p className={` font-light text-gray-400 text-lg sm:text-xl`}>Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        <Card className="border border-white/10 bg-[#111] rounded-xl text-white">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={` text-sm text-gray-400`}>
                  Email
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="border border-white/10 text-sm bg-black/50 h-10 rounded-lg focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] focus:outline-none transition-colors text-white"
                />
                {errors.email && (
                  <span className={`text-xs text-destructive `}>{errors.email.message}</span>
                )}
              </div>
              {(formState.error || formState.success) && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage message={formState} />
                </div>
              )}
              <SubmitButton
                pendingText="Sending..."
                disabled={isSubmitting}
                className={`h-10 text-sm  bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-lg transition-all duration-300`}
              >
                Send Reset Link
              </SubmitButton>
              <div className={`text-center text-sm  text-gray-400`}>
                Remember your password?{" "}
                <Link href="/sign-in" className="font-semibold text-white hover:text-[#0A66C2] transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
