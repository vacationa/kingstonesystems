import { Metadata } from "next";
import ResourcesDashboard from "./ResourcesDashboard";
import { loadSprintProgress } from "@/app/actions/sprint";

export const metadata: Metadata = {
    title: "Agency Vault | The AI Sprint",
    description: "Your comprehensive library of AI agency operating assets and templates.",
};

export default async function ResourcesPage() {
    let initialPrizes: Record<number, boolean> = {};
    let partnerStatus = "Awaiting Activation";

    try {
        const data = await loadSprintProgress();
        initialPrizes = data.prizes;

        // Load partner status
        const { getPartnerStatus } = await import("@/app/actions/sprint");
        partnerStatus = await getPartnerStatus();
    } catch (error) {
        console.error("Error loading sprint progress:", error);
    }

    return <ResourcesDashboard initialPrizes={initialPrizes} initialPartnerStatus={partnerStatus} />;
}
