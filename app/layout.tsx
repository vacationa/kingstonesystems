import { jetbrainsMono, inter } from "@/app/fonts/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Figtree } from "next/font/google";
import { Metadata } from "next";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

const defaultUrl =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://kingstonesystems.com");

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E40AF",
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl!),
  title: {
    default: "Kingstone Systems | AI Agents & Automation",
    template: "%s | Kingstone Systems",
  },
  description:
    "Custom AI agents and automations that handle customer inquiries, automate workflows, and help your business run smarter—24/7.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Kingstone Systems | AI Agents & Automation",
    description:
      "Custom AI agents and automations that handle customer inquiries, automate workflows, and help your business run smarter—24/7.",
    url: defaultUrl,
    siteName: "Kingstone Systems",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kingstone Systems | AI Agents & Automation",
    description:
      "Custom AI agents and automations that handle customer inquiries, automate workflows, and help your business run smarter—24/7.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${jetbrainsMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1E40AF" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-white antialiased",
          figtree.variable,
        )}
        style={{ fontFamily: "var(--font-figtree), system-ui, sans-serif" }}
      >
        <Providers>
          <div className="min-h-screen w-full relative">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
