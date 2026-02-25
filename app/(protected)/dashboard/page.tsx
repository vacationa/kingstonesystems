import { Metadata } from "next";
import SprintDashboard from "./SprintDashboard";
import { loadSprintProgress } from "@/app/actions/sprint";

export const metadata: Metadata = {
  title: "Mission Control | The AI Sprint",
  description: "Your 5-Day AI Agency Sprint tracker — complete tasks, unlock prizes, and build your agency.",
};

export default async function DashboardPage() {
  let initialChecked: Record<string, boolean> = {};
  let initialPrizes: Record<number, boolean> = {};

  try {
    const data = await loadSprintProgress();
    initialChecked = data.checked;
    initialPrizes = data.prizes;
  } catch (error) {
    console.error("Error loading sprint progress:", error);
    // Fall through with empty state — dashboard still works
  }

  return (
    <SprintDashboard
      initialChecked={initialChecked}
      initialPrizes={initialPrizes}
    />
  );
}