import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "The AI Sprint | Mission Control",
    absolute: "The AI Sprint | Mission Control",
  },
  description: "Sign in or create your account for The AI Sprint — your 5-Day AI Agency Sprint mission control.",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex justify-center items-center w-full min-h-screen overflow-hidden bg-black relative">
      <div className="relative z-10 w-full">
        {children}
      </div>
    </main>
  );
}
