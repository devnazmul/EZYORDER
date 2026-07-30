import Badge from "@/components/reuseable/Badge";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text, View } from "react-native";

interface SalesDailyListProps {
  dailyList: any[];
  currencySymbol: string;
}

export default function SalesDailyList({ dailyList, currencySymbol }: SalesDailyListProps) {
  if (dailyList.length === 0) {
    return (
      <Text
        style={{ fontSize: getResponsiveFontSize("xs"), paddingVertical: HP("5%") }}
        className="text-accent italic text-center"
      >
        No transactions recorded for this period.
      </Text>
    );
  }

  return (
    <View className="flex flex-col gap-3 pb-3">
      {dailyList.map((row: any, i: number) => (
        <View key={i} style={{ padding: WP("4%") }} className="bg-base-300 border border-base-200 rounded-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              {row.date}
            </Text>
            <Badge
              text={`${row.orders} ${row.orders === 1 ? "Order" : "Orders"}`}
              containerClassName="bg-primary/10"
              textClassName="text-primary"
            />
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-accent font-semibold capitalize mb-0.5"
              >
                Net Sales
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
                {formatAmount(row.net_sales, currencySymbol)}
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-accent font-semibold capitalize mb-0.5"
              >
                Cash
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
                {formatAmount(row.cash, currencySymbol)}
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-accent font-semibold capitalize mb-0.5"
              >
                Card
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
                {formatAmount(row.card, currencySymbol)}
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-accent font-semibold capitalize mb-0.5"
              >
                Discount
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-primary">
                {formatAmount(row.discounts, currencySymbol)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
