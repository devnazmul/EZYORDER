import ActionCard from "@/components/reuseable/cards/ActionCard";
import EmptyState from "@/components/reuseable/EmptyState";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import RecentOrderRow from "./RecentOrderRow";
import RecentOrdersSkeleton from "./skeletons/RecentOrdersSkeleton";

interface RecentOrdersProps {
  recentOrders: any[];
  isLoading: boolean;
}

export default function RecentOrders({ recentOrders = [], isLoading }: RecentOrdersProps) {
  return (
    <View className="">
      <ActionCard
        title="Recent Completed Orders"
        isLoading={isLoading}
        skeleton={<RecentOrdersSkeleton />}
        actionLabel="View Today's Orders"
        actionClassName="bg-primary"
        actionTextClassName="text-white"
        onActionPress={() =>
          router.push({
            pathname: "/orders/todays-orders",
          })
        }
      >
        {recentOrders.length === 0 ? (
          <EmptyState key="empty" description="No recent completed transactions" pyClassName="py-8" />
        ) : (
          <View key="loaded">
            {recentOrders.map((o: any, index: number) => (
              <RecentOrderRow
                key={o.id || index}
                order={o}
                index={index}
                isLast={index === recentOrders.length - 1}
              />
            ))}
          </View>
        )}
      </ActionCard>
    </View>
  );
}
