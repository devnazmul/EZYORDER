// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { Badge, CustomText } from "@/components/reuseable";

// 5. Feature types & utils
import type { ITable } from "../types/table.types";
import { getTableStatusConfig } from "../utils/getTableStatusConfig";

// 7. Constants/utils
import { getResponsiveFontSize, WP } from "@/utils";

interface ITableCardProps {
  table: ITable;
}

interface ITableIconProps {
  chairsCount?: number;
  size?: number;
}

const TableIcon = ({ chairsCount = 4, size = 54 }: ITableIconProps) => {
  const chairs = chairsCount || 4;
  const tableSize = size * 0.625;
  const chairWidth = size * 0.1875;
  const chairHeight = size * 0.125;
  const translateYVal = -size * 0.4375;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Table Surface */}
      <View
        style={{
          width: tableSize,
          height: tableSize,
          borderRadius: tableSize * 0.25,
          backgroundColor: "#fed7aa",
          borderColor: "#ffedd5",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: tableSize * 0.6,
            height: tableSize * 0.6,
            borderRadius: tableSize * 0.15,
            backgroundColor: "#fdba74",
            opacity: 0.3,
          }}
        />
      </View>

      {/* Dynamic Chairs */}
      {Array.from({ length: chairs }).map((_, i) => {
        const rotation = (i * 360) / chairs;
        return (
          <View
            key={`chair-${i.toString()}`}
            style={{
              position: "absolute",
              width: chairWidth,
              height: chairHeight,
              backgroundColor: "#fb923c",
              borderRadius: chairHeight * 0.25,
              opacity: 0.6,
              transform: [
                { rotate: `${rotation}deg` },
                { translateY: translateYVal },
              ],
            }}
          />
        );
      })}
    </View>
  );
};

export default function TableCard({ table }: Readonly<ITableCardProps>) {
  const cfg = getTableStatusConfig(table.status);
  const tableName = table.table_number || `Table ${table.table_no ?? table.id}`;

  return (
    <View
      style={{
        padding: WP("3%"),
        minHeight: 155,
      }}
      className={`rounded-2xl border border-base-200 flex-col justify-between ${
        table?.is_active ? "bg-base-300" : "bg-red-500/10"
      }`}
    >
      {/* Top row: Icon + Badges */}
      <View className="flex-row items-start justify-between">
        <View
          className={`rounded-xl ${cfg.circleBg} flex items-center justify-center shadow-sm p-4`}
        >
          <TableIcon chairsCount={table.capacity ?? 4} size={WP("10%")} />
        </View>

        <View className="flex-col items-end gap-1.5">
          <Badge
            text={cfg.label}
            containerClassName={`${cfg.badgeBg} border-0`}
            textClassName={`font-bold capitalize ${cfg.badgeText}`}
            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
          />
          <Badge
            text={table?.is_active ? "Active" : "Inactive"}
            containerClassName={`${table?.is_active ? "bg-green-100" : "bg-rose-100"} border-0`}
            textClassName={`font-bold capitalize ${table?.is_active ? "text-green-600" : "text-rose-600"}`}
            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
          />
          <Badge
            text={table?.area || "General"}
            containerClassName="bg-orange-100 border-0"
            textClassName="font-bold capitalize text-orange-600"
            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
          />
        </View>
      </View>

      {/* Info Section */}
      <View className="mt-3">
        <CustomText
          size="md"
          weight="bold"
          variant="primary"
          className="truncate"
        >
          {tableName}
        </CustomText>
        <CustomText
          size="xs"
          weight="semibold"
          variant="secondary"
          className="mt-1 capitalize"
        >
          {table.capacity ?? 0} Capacity
        </CustomText>
      </View>
    </View>
  );
}
