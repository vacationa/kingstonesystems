"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Monitor, MousePointer, Keyboard, Scroll, X, Play, Square } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface LinkedInWebSocketConnectProps {
  userId: string;
  email: string;
  password: string;
  onSuccess?: (data: { li_at: string; li_a?: string; email?: string }) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  setCloseSession?: (closeFn: () => void) => void;
  onShowCanvas?: () => void;
}

interface SessionStatus {
  hasSession: boolean;
  isLoggedIn: boolean;
  url: string | null;
  sessionId: string | null;
}

export default function LinkedInWebSocketConnect({
  userId,
  email,
  password,
  onSuccess,
  onError,
  onClose,
  setCloseSession,
  onShowCanvas,
}: LinkedInWebSocketConnectProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [screencastData, setScreencastData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [inputOverlay, setInputOverlay] = useState<{
    email: string;
    password: string;
    activeField: "email" | "password" | null;
    cursorPosition: number;
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>({
    email: "",
    password: "",
    activeField: null,
    cursorPosition: 0,
  });

  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text">("default");
  const [lastClickPosition, setLastClickPosition] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => [...prev.slice(-9), `[${timestamp}] ${info}`]);
  };

  useEffect(() => {
    return () => {
      setHasAttemptedConnection(false);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Автоматичне підключення та запуск сесії при ініціалізації компонента
  useEffect(() => {
    // console.log("🔧 LinkedInWebSocketConnect useEffect triggered", {
    //   userId,
    //   isConnected,
    //   isConnecting,
    //   hasAttemptedConnection,
    // });

    if (userId && !hasAttemptedConnection && !isConnected && !isConnecting) {
      // console.log("🚀 Auto-connecting to WebSocket and starting session...");
      setHasAttemptedConnection(true);

      // Add a small delay to avoid rapid mount/unmount cycles
      setTimeout(() => {
        if (!isConnecting && !isConnected) {
          connectToWebSocket();
        }
      }, 100);
    } else {
      // console.log("🔧 Skipping connection - already attempted or connected");
    }
  }, [userId, hasAttemptedConnection, isConnected, isConnecting]);

  const connectToWebSocket = async () => {
    // console.log("🔌 connectToWebSocket called!", {
    //   userId,
    //   existingSocket: !!socket,
    //   isConnecting,
    // });
    // console.log("🔌 Current state:", { isConnected, isConnecting, hasSocket: !!socket });

    if (socket || isConnecting) {
      // console.log("🔌 Already connected or connecting, skipping...");
      return;
    }

    setIsConnecting(true);
    setError(null);
    addDebugInfo("Connecting to WebSocket server...");

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "http://localhost:3008";

    try {
      const newSocket = io(SOCKET_URL, {
        query: { user_id: userId },
        transports: ["websocket", "polling"],
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        // console.log("✅ WebSocket connected successfully!");
        setIsConnected(true);
        setIsConnecting(false);
        addDebugInfo("Connected to WebSocket server");

        // Автоматично запускаємо браузерну сесію після підключення
        // console.log("🚀 Auto-starting browser session...");
        newSocket.emit("startLogin", { email, password });
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        addDebugInfo("Disconnected from WebSocket server");
      });

      newSocket.on("connected", (data) => {
        addDebugInfo(`Server: ${data.message}`);
      });

      newSocket.on("readyForLogin", (data) => {
        addDebugInfo(`Ready for login: ${data.message}`);
        setSessionStatus((prev) => ({
          hasSession: true,
          isLoggedIn: prev?.isLoggedIn || false,
          url: data.url,
          sessionId: prev?.sessionId || null,
        }));
      });

      newSocket.on("loginStarted", (data) => {
        addDebugInfo(`Login started: ${data.message}`);
      });

      newSocket.on("showCanvas", (data) => {
        addDebugInfo(`Canvas requested: ${data.message}`);
        setShowCanvas(true);
        if (onShowCanvas) {
          onShowCanvas();
        }
      });

      newSocket.on("loginSuccess", (data) => {
        addDebugInfo(`Login successful: ${data.message}`);
        setSessionStatus((prev) => ({
          hasSession: prev?.hasSession || true,
          isLoggedIn: true,
          url: data.url,
          sessionId: prev?.sessionId || null,
        }));

        if (onSuccess) {
          // Build payload without placeholder values
          const li_at = data?.cookies?.li_at;
          const li_a = data?.cookies?.li_a;
          const jsessionid = data?.cookies?.jsessionid;

          onSuccess({
            // only pass values that exist; consumers should filter before sending to API
            li_at: li_at,
            li_a: li_a,
            jsessionid: jsessionid,
            email: data?.email || email,
          } as any);
        }

        // НЕ закриваємо сесію одразу - це тепер робить backend
        // Автоматично закриваємо модалку через 5 секунд після успішної авторизації
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 5000);
      });

      newSocket.on("salesNavReauthRequired", (data) => {
        addDebugInfo(`Sales Navigator re-authentication required: ${data.message}`);
        // Показуємо повідомлення про потребу в повторній авторизації
        setError("Sales Navigator requires re-authentication. Please log in again.");

        // Закриваємо з'єднання для повторної авторизації
        if (newSocket) {
          newSocket.emit("closeSession");
        }

        // Закриваємо модалку через 3 секунди
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 3000);
      });

      newSocket.on("sessionStatus", (data) => {
        setSessionStatus(data);
        addDebugInfo(
          `Session status: ${data.hasSession ? "Active" : "None"}, Logged in: ${data.isLoggedIn}`,
        );
      });

      newSocket.on("sessionClosed", (data) => {
        addDebugInfo(`Session closed: ${data.message}`);
        setSessionStatus(null);
        setScreencastData(null);
        setIsImageLoaded(false);

        // Викликаємо onClose якщо він переданий
        if (onClose) {
          onClose();
        }
      });

      newSocket.on("screencast", (data) => {
        // Check for double base64 issue
        if (data.data && typeof data.data === "string") {
          if (data.data.includes("data:image/jpeg;base64,data:image/jpeg;base64,")) {
            // no-op for invalid double-base64 case
          } else if (data.data.startsWith("data:image/jpeg;base64,")) {
            setScreencastData(data.data);
            setIsImageLoaded(true);
          } else if (data.data.startsWith("data:image/png;base64,")) {
            setScreencastData(data.data);
            setIsImageLoaded(true);
          } else {
            // no-op for invalid format
          }
        } else {
          // no-op for missing/invalid data
        }
      });

      newSocket.on("inputUpdated", (data) => {
        // console.log("Frontend: Received inputUpdated event:", JSON.stringify(data, null, 2));

        if (data.element) {
          addDebugInfo(`Input updated: ${data.element.type} field - "${data.element.value}"`);
          // console.log("Frontend: Processing element update:", data.element);
          // console.log("Frontend: Element position:", data.element.position);

          // Update input overlay based on element type and placeholder
          const isEmailField =
            data.element.type === "email" ||
            data.element.placeholder?.toLowerCase().includes("email") ||
            data.element.placeholder?.toLowerCase().includes("phone");

          const isPasswordField =
            data.element.type === "password" ||
            data.element.placeholder?.toLowerCase().includes("password");

          // console.log("Frontend: Field detection:", {
          //   isEmailField,
          //   isPasswordField,
          //   type: data.element.type,
          //   placeholder: data.element.placeholder,
          // });

          if (isEmailField) {
            // console.log("Frontend: Updating email field with value:", data.element.value);
            // console.log("Frontend: Position data:", data.element.position);
            // console.log("Frontend: Alt position data:", data.element.altPosition);
            // console.log("Frontend: Selector:", data.element.selector);
            // console.log("Frontend: Position type:", typeof data.element.position);
            // console.log(
            //   "Frontend: Position keys:",
            //   data.element.position ? Object.keys(data.element.position) : "undefined",
            // );

            // Try to find position using multiple methods
            let finalPosition = data.element.position;

            if (!finalPosition || finalPosition.x === 0) {
              // console.log("Frontend: Using alt position");
              finalPosition = data.element.altPosition;
            }

            if (!finalPosition || finalPosition.x === 0) {
              // console.log("Frontend: Trying to find element by selector");
              // Try to find element on frontend and get its position
              const element = document.querySelector(data.element.selector);
              if (element) {
                const rect = element.getBoundingClientRect();
                finalPosition = {
                  x: rect.left,
                  y: rect.top,
                  width: rect.width,
                  height: rect.height,
                };
                // console.log("Frontend: Found element by selector, position:", finalPosition);
              }
            }

            setInputOverlay((prev) => {
              const newState = {
                ...prev,
                email: data.element.value,
                activeField: "email" as const,
                cursorPosition: data.element.cursorPosition,
                position: finalPosition,
              };
              // console.log("Frontend: New email overlay state:", newState);
              return newState;
            });
          } else if (isPasswordField) {
            // console.log("Frontend: Updating password field with value:", data.element.value);
            setInputOverlay((prev) => {
              const newState = {
                ...prev,
                password: data.element.value,
                activeField: "password" as const,
                cursorPosition: data.element.cursorPosition,
                position: data.element.position,
              };
              // console.log("Frontend: New password overlay state:", newState);
              return newState;
            });
          } else {
            // console.log("Frontend: Clearing active field - unknown field type");
            // Clear active field if clicking elsewhere
            setInputOverlay((prev) => ({
              ...prev,
              activeField: null,
              cursorPosition: 0,
              position: undefined,
            }));
          }
        } else {
          // Clear overlay when no active element
          addDebugInfo("Input cleared - no active element");
          // console.log("Frontend: Clearing overlay - no active element");
          setInputOverlay((prev) => ({
            ...prev,
            activeField: null,
            cursorPosition: 0,
          }));
        }
      });

      newSocket.on("fieldClicked", (data) => {
        // console.log("Frontend: Received fieldClicked event:", data);

        if (data.success) {
          addDebugInfo(`Field clicked successfully: ${data.fieldType}`);
          // console.log(
          //   "Frontend: Field click successful:",
          //   data.fieldType,
          //   "using selector:",
          //   data.selector,
          // );

          // Update active field based on the clicked field
          if (data.fieldType === "email") {
            setInputOverlay((prev) => ({
              ...prev,
              activeField: "email",
              cursorPosition: prev.email.length,
            }));
          } else if (data.fieldType === "password") {
            setInputOverlay((prev) => ({
              ...prev,
              activeField: "password",
              cursorPosition: prev.password.length,
            }));
          } else if (data.fieldType === "signin") {
            // Clear active field when clicking sign in button
            setInputOverlay((prev) => ({
              ...prev,
              activeField: null,
              cursorPosition: 0,
            }));
          }
        } else {
          addDebugInfo(`Field click failed: ${data.error}`);
        }
      });

      newSocket.on("error", (data) => {
        setError(data);
        addDebugInfo(`Error: ${data}`);
        if (onError) {
          onError(data);
        }
      });

      newSocket.on("authError", (data) => {
        addDebugInfo(`Authentication error: ${data.message}`);
        setError(data.message);
        setShowCanvas(false); // Закриваємо canvas при помилці авторизації

        if (onError) {
          onError(data.message);
        }

        // Закриваємо з'єднання
        newSocket.close();
      });

      // Слухач для помилок LinkedIn (ERR_TOO_MANY_REDIRECTS тощо)
      newSocket.on("linkedinError", (data) => {
        addDebugInfo(`LinkedIn error: ${data.message}`);

        if (data.type === "too_many_redirects") {
          setError(data.message);

          if (onError) {
            onError(data.message);
          }

          newSocket.close();
        }
      });

      setSocket(newSocket);
    } catch (error) {
      setIsConnecting(false);
      setError(`Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`);
      addDebugInfo(
        `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // const startLogin = () => {
  //   if (!socket) return;

  //   setIsLoading(true);
  //   addDebugInfo("Starting LinkedIn login...");
  //   console.log("Frontend: Sending credentials:", { email, password });
  //   socket.emit("startLogin", { email, password });
  // };

  const closeSession = () => {
    if (socket) {
      socket.emit("closeSession");
    }
  };

  // Передаємо функцію закриття батьківському компоненту
  useEffect(() => {
    if (setCloseSession) {
      setCloseSession(() => closeSession);
    }
  }, [socket, setCloseSession]);

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to match the actual image size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    setCursorPosition({ x: scaledX, y: scaledY });

    // Determine cursor type based on position
    const emailFieldArea = { x: 448, y: 264, width: 304, height: 52 };
    const passwordFieldArea = { x: 448, y: 316, width: 304, height: 52 };
    const signInButtonArea = { x: 448, y: 400, width: 304, height: 48 };

    if (
      (scaledX >= emailFieldArea.x &&
        scaledX <= emailFieldArea.x + emailFieldArea.width &&
        scaledY >= emailFieldArea.y &&
        scaledY <= emailFieldArea.y + emailFieldArea.height) ||
      (scaledX >= passwordFieldArea.x &&
        scaledX <= passwordFieldArea.x + passwordFieldArea.width &&
        scaledY >= passwordFieldArea.y &&
        scaledY <= passwordFieldArea.y + passwordFieldArea.height)
    ) {
      setCursorType("text");
    } else if (
      scaledX >= signInButtonArea.x &&
      scaledX <= signInButtonArea.x + signInButtonArea.width &&
      scaledY >= signInButtonArea.y &&
      scaledY <= signInButtonArea.y + signInButtonArea.height
    ) {
      setCursorType("pointer");
    } else {
      setCursorType("default");
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // console.log("🎯 handleCanvasClick called!", {
    //   socket: !!socket,
    //   canvasRef: !!canvasRef.current,
    //   isConnected,
    //   screencastData: !!screencastData,
    //   eventType: event.type,
    //   clientX: event.clientX,
    //   clientY: event.clientY,
    //   target: event.target,
    //   currentTarget: event.currentTarget,
    // });

    // Додаємо додаткове логування для дебагу
    // console.log("🎯 Canvas element:", {
    //   canvas: canvasRef.current,
    //   canvasWidth: canvasRef.current?.width,
    //   canvasHeight: canvasRef.current?.height,
    //   canvasStyle: canvasRef.current?.style,
    // });

    if (!socket || !canvasRef.current) {
      // console.log("❌ Early return - socket or canvas not available");
      return;
    }

    // Фокусуємо input для клавіатури при кліку на canvas
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      // console.log("🎯 Input focused for keyboard events");
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate the scale factor between display size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Convert display coordinates to actual page coordinates
    const pageX = x * scaleX;
    const pageY = y * scaleY;

    // Store last click position for debugging
    setLastClickPosition({ x: pageX, y: pageY });

    // console.log("🎯 UI Click detected:", {
    //   display: { x: Math.round(x), y: Math.round(y) },
    //   page: { x: Math.round(pageX), y: Math.round(pageY) },
    //   canvas: { width: canvas.width, height: canvas.height },
    //   rect: { width: rect.width, height: rect.height },
    // });

    addDebugInfo(
      `🎯 UI Click: display (${Math.round(x)}, ${Math.round(y)}) -> page (${Math.round(pageX)}, ${Math.round(pageY)})`,
    );

    // Clear click indicator after 3 seconds
    setTimeout(() => {
      setLastClickPosition(null);
    }, 3000);

    // Check if click is on email, password, or sign in button areas (approximate LinkedIn positions)
    const emailFieldArea = { x: 448, y: 264, width: 304, height: 52 };
    const passwordFieldArea = { x: 448, y: 316, width: 304, height: 52 };
    const signInButtonArea = { x: 448, y: 400, width: 304, height: 48 }; // Approximate sign in button area

    if (
      pageX >= emailFieldArea.x &&
      pageX <= emailFieldArea.x + emailFieldArea.width &&
      pageY >= emailFieldArea.y &&
      pageY <= emailFieldArea.y + emailFieldArea.height
    ) {
      // Click on email field
      // console.log("Clicking email field");
      addDebugInfo("Clicking email field");
      socket.emit("clickField", {
        fieldType: "email",
        x: pageX,
        y: pageY,
      });

      // Update local state
      setInputOverlay((prev) => ({
        ...prev,
        activeField: "email",
        cursorPosition: prev.email.length,
      }));
    } else if (
      pageX >= passwordFieldArea.x &&
      pageX <= passwordFieldArea.x + passwordFieldArea.width &&
      pageY >= passwordFieldArea.y &&
      pageY <= passwordFieldArea.y + passwordFieldArea.height
    ) {
      // Click on password field
      // console.log("Clicking password field");
      addDebugInfo("Clicking password field");
      socket.emit("clickField", {
        fieldType: "password",
        x: pageX,
        y: pageY,
      });

      // Update local state
      setInputOverlay((prev) => ({
        ...prev,
        activeField: "password",
        cursorPosition: prev.password.length,
      }));
    } else if (
      pageX >= signInButtonArea.x &&
      pageX <= signInButtonArea.x + signInButtonArea.width &&
      pageY >= signInButtonArea.y &&
      pageY <= signInButtonArea.y + signInButtonArea.height
    ) {
      // Click on sign in button
      // console.log("🔘 Clicking sign in button");
      addDebugInfo("Clicking sign in button");

      // console.log("🔘 Sending clickField event:", { fieldType: "signin", x: pageX, y: pageY });
      socket.emit("clickField", {
        fieldType: "signin",
        x: pageX,
        y: pageY,
      });
    } else {
      // Regular mouse click
      // console.log("🖱️ Sending regular mouse click to backend:", { x: pageX, y: pageY });

      socket.emit("mouse", {
        type: "click",
        x: pageX,
        y: pageY,
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!socket) return;

    let key = event.key;

    // Handle special keys
    if (event.key === "Enter") key = "Enter";
    else if (event.key === "Tab") key = "Tab";
    else if (event.key === "Escape") key = "Escape";
    else if (event.key === "Backspace") key = "Backspace";
    else if (event.key === "Delete") key = "Delete";
    else if (event.key === "ArrowUp") key = "ArrowUp";
    else if (event.key === "ArrowDown") key = "ArrowDown";
    else if (event.key === "ArrowLeft") key = "ArrowLeft";
    else if (event.key === "ArrowRight") key = "ArrowRight";

    addDebugInfo(`Key pressed: ${key}`);
    // console.log("Frontend: Sending keyboard event:", { type: "press", key });

    socket.emit("keyboard", {
      type: "press",
      key: key,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!socket) return;

    const value = event.target.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      addDebugInfo(`Input: ${lastChar}`);

      socket.emit("keyboard", {
        type: "type",
        key: lastChar,
      });
    }
  };

  const handleScroll = (event: React.WheelEvent) => {
    if (!socket) return;

    addDebugInfo(`Scroll: ${event.deltaY}`);

    socket.emit("scroll", {
      type: "wheel",
      deltaY: event.deltaY,
    });
  };

  // Debug state changes
  useEffect(() => {}, [isConnected, showCanvas, screencastData, isImageLoaded, sessionStatus]);

  // Update canvas when screencast data changes
  useEffect(() => {
    if (screencastData && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      img.onload = () => {
        if (ctx) {
          // Set canvas size to match the natural image size (original logic)
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
        }
      };

      img.onerror = (error) => {
        // console.error("Frontend: Image load error:", error);
        // console.error("Frontend: Failed to load image from:", screencastData.substring(0, 100));
      };

      img.src = screencastData;
    } else {
      // console.log("Frontend: Canvas update skipped", {
      //   hasScreencastData: !!screencastData,
      //   hasCanvasRef: !!canvasRef.current,
      //   hasImageRef: !!imageRef.current,
      // });
    }
  }, [screencastData]);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Browser View */}
      {isConnected && (showCanvas || screencastData) ? (
        <div className="w-full h-full flex flex-col">
          <div className="relative flex-1 bg-white overflow-hidden">
            {!isImageLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-outfit">Waiting for browser screenshot...</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center overflow-hidden p-2">
                <canvas
                  ref={canvasRef}
                  style={{
                    imageRendering: "auto",
                    cursor: "pointer",
                    userSelect: "none",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  onWheel={handleScroll}
                  onKeyDown={handleKeyPress}
                  onKeyUp={handleKeyPress}
                  tabIndex={0}
                />
              </div>
            )}
            <img ref={imageRef} style={{ display: "none" }} alt="Screencast" />

            {/* Hidden input for keyboard events */}
            <input
              ref={hiddenInputRef}
              type="text"
              className="absolute inset-0 opacity-0"
              onKeyDown={handleKeyPress}
              onFocus={() => addDebugInfo("Input focused - keyboard active")}
              onBlur={() => addDebugInfo("Input blurred")}
              autoFocus
              tabIndex={-1}
              style={{
                pointerEvents: "none",
                zIndex: -1,
              }}
            />
          </div>
        </div>
      ) : isConnected ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 font-outfit">Logging you in...</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 font-outfit">Connecting to browser session...</p>
          </div>
        </div>
      )}
    </div>
  );
}
