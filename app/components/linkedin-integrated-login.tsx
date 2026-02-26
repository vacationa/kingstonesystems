"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Monitor,
  MousePointer,
  Keyboard,
  Scroll,
  X,
  Play,
  Square,
  Eye,
  EyeOff,
} from "lucide-react";
import LinkedInWebSocketConnect from "./linkedin-websocket-connect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkedInIntegratedLoginProps {
  onSuccess?: (cookies: { li_at?: string; li_a?: string }) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  userId?: string;
  inline?: boolean;
}

export function LinkedInIntegratedLogin({
  onSuccess,
  onError,
  onClose,
  userId,
  inline = false,
}: LinkedInIntegratedLoginProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<{ li_at?: string; li_a?: string } | null>(null);
  const [showWebSocketMode, setShowWebSocketMode] = useState(false);
  const [wsUserId, setWsUserId] = useState<string>("");
  const [closeSession, setCloseSession] = useState<(() => void) | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Initialize WebSocket user ID: prefer provided userId, else use stored or generate
    const initializeUserId = () => {
      if (userId && userId.trim()) {
        setWsUserId(userId);
        return;
      }
      const storedUserId = localStorage.getItem("linkedin_user_id");
      if (storedUserId) {
        setWsUserId(storedUserId);
      } else {
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("linkedin_user_id", newUserId);
        setWsUserId(newUserId);
      }
    };

    initializeUserId();
  }, [userId]);

  const handleLoginSuccess = async (cookies: {
    li_at?: string;
    li_a?: string;
    jsessionid?: string;
    email?: string;
  }) => {
    try {
      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);

        // Update status and show cookies
        setIsConnected(true);
        setCookies(cookies);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        if (onSuccess) {
          onSuccess(cookies);
        }
      } else {
        setError("No authentication cookies found. Please try logging in again.");
      }
    } catch (error) {
      setError("Failed to process login credentials. Please try again.");
    }
  };

  const saveLinkedInCookies = async (cookies: {
    li_at?: string;
    li_a?: string;
    // jsessionid?: string;
    email?: string;
  }) => {
    try {
      // console.log("💾 Saving cookies to backend...");

      const payload: any = {
        email: cookies.email || "unknown@example.com",
      };
      // Only include cookie fields if they are present and not a placeholder
      if (cookies.li_at && cookies.li_at !== "not_available") payload.li_at = cookies.li_at;
      if (cookies.li_a && cookies.li_a !== "not_available") payload.li_a = cookies.li_a;
      // if (cookies.jsessionid && cookies.jsessionid !== "not_available")
      //   payload.jsessionid = cookies.jsessionid;

      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save LinkedIn credentials");
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleWebSocketSuccess = async (data: {
    li_at: string;
    li_a?: string;
    // jsessionid?: string;
    email?: string;
  }) => {
    await handleLoginSuccess(data);
  };

  const handleWebSocketError = (error: string) => {
    setError(error);
    setIsLoading(false);
    setShowCanvas(false); // Закриваємо canvas при помилці
    setShowWebSocketMode(false); // Повертаємо до початкового стану
  };

  const handleShowCanvas = () => {
    setShowCanvas(true);
    setShowWebSocketMode(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) {
      setEmailError(!validateEmail(value));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordTouched) {
      setPasswordError(!validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(!validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(!validatePassword(password));
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    return isEmailValid && isPasswordValid;
  };

  const handleCloseModal = () => {
    if (closeSession) {
      closeSession();
    }
    setShowWebSocketMode(false);
    setShowCanvas(false);
    setIsLoading(false);
    setError(null);
    if (onClose) {
      onClose();
    }
  };

  const handleBackToNormal = () => {
    setShowWebSocketMode(false);
    setError(null);
  };

  // Show WebSocket mode (canvas) only when CAPTCHA is detected
  if (showCanvas) {
    return createPortal(
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col border border-black/10">
          <div className="flex items-center justify-between p-4 border-b border-black/10 flex-shrink-0">
            <div>
              <h3 className=" text-xl font-semibold text-gray-900">LinkedIn Login</h3>
              <p className="text-gray-500 text-sm mt-1 ">
                Use the browser to log in to your LinkedIn account
              </p>
            </div>
            {onClose && (
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden bg-gray-50/30">
            <LinkedInWebSocketConnect
              userId={wsUserId}
              email={email}
              password={password}
              onSuccess={handleWebSocketSuccess}
              onError={handleWebSocketError}
              onClose={handleCloseModal}
              setCloseSession={setCloseSession}
              onShowCanvas={handleShowCanvas}
            />
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // Show main login interface
  const content = (
    <>
      <div className="text-center mb-6">
        <h2 className=" text-2xl text-gray-900 mb-3 tracking-tight">
          Connect LinkedIn Account
        </h2>
        <p className="text-gray-500 text-base  font-light leading-relaxed">
          Enter your LinkedIn credentials
        </p>
      </div>

      <div className="space-y-4">
        {/* Credentials Form */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" className=" text-sm text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your LinkedIn email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={
                emailTouched && emailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-black/10 focus:border-black/20"
              }
            />
            {emailTouched && emailError && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className=" text-sm text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your LinkedIn password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={
                  passwordTouched && passwordError
                    ? "border-red-500 focus:border-red-500 pr-10"
                    : "border-black/10 focus:border-black/20 pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {passwordTouched && passwordError && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (!validateForm()) {
              return;
            }
            setIsLoading(true);
            // Запускаємо WebSocket підключення в фоні
            setShowWebSocketMode(true);
          }}
          disabled={isLoading}
          className="w-full px-6 py-2.5 bg-white text-black border border-black/10 rounded-xl hover:border-black/20 transition-all duration-200  text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging you in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Close button */}
        {onClose && (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800  text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (inline) {
    return (
      <>
        {content}
        {/* Hidden WebSocket component for background processing */}
        {showWebSocketMode && !showCanvas && (
          <div style={{ display: "none" }}>
            <LinkedInWebSocketConnect
              userId={wsUserId}
              email={email}
              password={password}
              onSuccess={handleWebSocketSuccess}
              onError={handleWebSocketError}
              onClose={handleCloseModal}
              setCloseSession={setCloseSession}
              onShowCanvas={handleShowCanvas}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-black/10 p-8">
        {content}
      </div>
      {/* Hidden WebSocket component for background processing */}
      {showWebSocketMode && !showCanvas && (
        <div style={{ display: "none" }}>
          <LinkedInWebSocketConnect
            userId={wsUserId}
            email={email}
            password={password}
            onSuccess={handleWebSocketSuccess}
            onError={handleWebSocketError}
            onClose={handleCloseModal}
            setCloseSession={setCloseSession}
            onShowCanvas={handleShowCanvas}
          />
        </div>
      )}
    </div>
  );
}
