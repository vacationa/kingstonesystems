"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/auth";

export default function OperatorLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState({ email: false, password: false });
    const router = useRouter();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length >= 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTouched({ email: true, password: true });

        if (!emailValid || !passwordValid) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const result = await signInAction(formData);

            if ("error" in result) {
                setError(result.error ?? "An error occurred. Please try again.");
                setLoading(false);
                return;
            }

            if (result.success) {
                router.push("/dashboard");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#F8FAFC",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-figtree, 'Figtree', system-ui, sans-serif)",
                padding: "24px 16px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle light radial */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(30,64,175,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px", gap: "14px" }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        <img src="/assets/newlogo.png" alt="Kingstone Systems" style={{ height: "40px", width: "auto", borderRadius: "6px" }} />
                        <span style={{ fontSize: "17px", fontWeight: 500, color: "#1F2937" }}>Kingstone Systems</span>
                    </Link>

                    <div style={{ background: "rgba(30,64,175,0.08)", border: "1px solid rgba(30,64,175,0.15)", borderRadius: "20px", padding: "4px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#1E40AF", letterSpacing: "0.8px", textTransform: "uppercase" }}>Internal Access</span>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                            Internal Portal
                        </h1>
                    </div>
                </div>

                {/* Card */}
                <div
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "16px",
                        padding: "36px 32px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
                    }}
                >
                    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Email */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="op-email" style={{ fontSize: "13px", fontWeight: 600, color: "#374151", letterSpacing: "0.2px" }}>
                                Email
                            </label>
                            <input
                                id="op-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                placeholder="operator@kingstonesystems.com"
                                style={{
                                    height: "44px",
                                    padding: "0 14px",
                                    fontSize: "15px",
                                    color: "#111827",
                                    background: "#FAFAFA",
                                    border: `1.5px solid ${touched.email && !emailValid ? "#EF4444" : "#E5E7EB"}`,
                                    borderRadius: "10px",
                                    outline: "none",
                                    fontFamily: "inherit",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.15s",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
                                onBlurCapture={(e) => {
                                    if (!(touched.email && !emailValid))
                                        e.currentTarget.style.borderColor = "#E5E7EB";
                                }}
                            />
                            {touched.email && !emailValid && (
                                <span style={{ fontSize: "12px", color: "#EF4444" }}>Valid email required</span>
                            )}
                        </div>

                        {/* Password */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label htmlFor="op-password" style={{ fontSize: "13px", fontWeight: 600, color: "#374151", letterSpacing: "0.2px" }}>
                                    Password
                                </label>
                                <Link href="/forgot-password" style={{ fontSize: "13px", color: "#1E40AF", textDecoration: "none", fontWeight: 500 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1E3A8A")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#1E40AF")}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="op-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                    placeholder="••••••••"
                                    style={{
                                        height: "44px",
                                        padding: "0 44px 0 14px",
                                        fontSize: "15px",
                                        color: "#111827",
                                        background: "#FAFAFA",
                                        border: `1.5px solid ${touched.password && !passwordValid ? "#EF4444" : "#E5E7EB"}`,
                                        borderRadius: "10px",
                                        outline: "none",
                                        fontFamily: "inherit",
                                        width: "100%",
                                        boxSizing: "border-box",
                                        transition: "border-color 0.15s",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
                                    onBlurCapture={(e) => {
                                        if (!(touched.password && !passwordValid))
                                            e.currentTarget.style.borderColor = "#E5E7EB";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "4px", display: "flex", alignItems: "center" }}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {touched.password && !passwordValid && (
                                <span style={{ fontSize: "12px", color: "#EF4444" }}>Password is required</span>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                                    <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="1.5" />
                                    <path d="M10 6v4M10 14h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span style={{ fontSize: "13.5px", color: "#B91C1C", fontWeight: 500 }}>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                height: "44px",
                                background: loading ? "#6B7280" : "#1E40AF",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "background 0.2s, transform 0.15s",
                                boxShadow: loading ? "none" : "0 1px 2px rgba(30,64,175,0.2), 0 4px 12px rgba(30,64,175,0.15)",
                            }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1E3A8A"; }}
                            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1E40AF"; }}
                        >
                            {loading && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        <p style={{ textAlign: "center", fontSize: "14px", color: "#4B5563", marginTop: "4px", marginBottom: 0 }}>
                            Don't have an account?{" "}
                            <Link href="/sign-up" style={{ color: "#1E40AF", textDecoration: "none", fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#1E3A8A")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#1E40AF")}
                            >
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link
                        href="/"
                        style={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    >
                        ← Back to kingstonesystems.com
                    </Link>
                </p>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
