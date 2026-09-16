// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { KpiCard } from "@/components/reuseable";

// 6. Types
import type { ITableMatrixSummary } from "../types/table.types";

// ==================== TYPES ====================
export interface ITableKpiCardsProps {
  matrix?: ITableMatrixSummary | null;
  loading?: boolean;
}

// ==================== COMPONENT ====================
export default function TableKpiCards({
  matrix,
  loading = false,
}: Readonly<ITableKpiCardsProps>) {
  if (!matrix && !loading) return null;

  return (
    <View className="mb-3">
      <View className="flex-col gap-2">
        {/* Row 1 */}
        <View className="flex-row flex-1 gap-2">
          <View className="flex-1">
            <KpiCard
              title="Total Tables"
              value={String(matrix?.total ?? 0)}
              icon="restaurant"
              variant="dark"
              iconBgColor="#14B8A6"
              iconColor="#ffffff"
              gradientColors={["#2d3e56", "#1b283c"]}
              loading={loading}
            />
          </View>
          <View className="flex-1">
            <KpiCard
              title="Occupied"
              value={String(matrix?.occupied ?? 0)}
              icon="cancel"
              variant="dark"
              iconBgColor="#F43F5E"
              iconColor="#ffffff"
              gradientColors={["#1e4f43", "#11322b"]}
              loading={loading}
            />
          </View>
        </View>

        {/* Row 2 */}
        <View className="flex-row flex-1 gap-2">
          <View className="flex-1">
            <KpiCard
              title="Reserved"
              value={String(matrix?.reserved ?? 0)}
              icon="event-seat"
              variant="dark"
              iconBgColor="#8B5CF6"
              iconColor="#ffffff"
              gradientColors={["#4c3590", "#2e1e5c"]}
              loading={loading}
            />
          </View>
          <View className="flex-1">
            <KpiCard
              title="Available"
              value={String(matrix?.free ?? 0)}
              icon="check-circle"
              variant="dark"
              iconBgColor="#10B981"
              iconColor="#ffffff"
              gradientColors={["#6d242b", "#3d1115"]}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
