// 1. React / React Native
import { useState } from "react";

// 4. Shared components
import { PageTitle, ScreenContainer, ToggleBar } from "@/components/reuseable";

// 5. Feature components
import { ReservationsView, TablesView } from "../components";

const TOGGLE_OPTIONS = [
  { id: "tables", label: "Tables", icon: "table-restaurant" as const },
  { id: "reservations", label: "Reservations", icon: "event" as const },
];

export default function TablesAndReservations() {
  const [activeTab, setActiveTab] = useState("tables");
  const isTablesTab = activeTab === "tables";

  return (
    <ScreenContainer scrollable={false}>
      <PageTitle
        title="Tables & Reservations"
        icon="table-restaurant"
        description={`See details of ${activeTab === "tables" ? "Tables" : "Reservations"}`}
      />

      {/* Toggle Bar */}
      <ToggleBar
        options={TOGGLE_OPTIONS}
        activeId={activeTab}
        onSelect={setActiveTab}
      />

      {isTablesTab ? <TablesView /> : <ReservationsView />}
    </ScreenContainer>
  );
}
