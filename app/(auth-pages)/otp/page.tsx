"use client";

import { verifyOtpAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { aeonik } from "../../fonts/fonts";

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

function OtpVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [formState, setFormState] = useState<{ success?: string; error?: string }>({});
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Update form value
    const otpString = newOtp.join("");
    setValue("otp", otpString);

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setValue("otp", pastedData);
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await verifyOtpAction(formData);

      if (result.error) {
        setError("root", {
          message: result.error,
        });
        return;
      }

      if (result.success) {
        setFormState({ success: result.message });
        router.push("/dashboard");
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleResendOtp = () => {
    // Implement the logic to resend OTP
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
          <h1 className={`${aeonik.variable} font-aeonik text-2xl md:text-3xl font-bold text-slate-900 mb-2`}>
            Email Verification
          </h1>
          <p className={`${aeonik.variable} font-aeonik font-light text-slate-500 text-base`}>
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Card className="border border-slate-200 bg-white rounded-3xl text-slate-900 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("email")} />
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-xl font-semibold text-center bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-all duration-200 shadow-none outline-none"
                      style={{ caretColor: 'transparent' }}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <span className={`text-xs text-destructive ${aeonik.variable} font-aeonik text-center block`}>{errors.otp.message}</span>
                )}
              </div>
              {errors.root && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage message={{ error: errors.root.message }} />
                </div>
              )}
              <SubmitButton
                pendingText="Verifying..."
                disabled={isSubmitting}
                className={`h-11 mt-2 text-sm ${aeonik.variable} font-aeonik bg-blue-700 text-white hover:bg-blue-800 rounded-xl transition-all duration-300 font-semibold shadow-sm`}
              >
                Verify Email
              </SubmitButton>
              <div className={`text-center text-sm ${aeonik.variable} font-aeonik text-slate-600 mt-2`}>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-medium text-blue-700 hover:underline transition-colors"
                >
                  Resend
                </button>
              </div>
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

export default function OtpVerificationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationContent />
    </Suspense>
  );
}
