import { Metadata } from "next";
import ResourcesDashboard from "./ResourcesDashboard";

export const metadata: Metadata = {
    title: "Agency Vault | The AI Sprint",
    description: "Your comprehensive library of AI agency operating assets and templates.",
};

export default function ResourcesPage() {
    return <ResourcesDashboard />;
}
