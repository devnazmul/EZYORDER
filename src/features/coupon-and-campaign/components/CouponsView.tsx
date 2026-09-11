import { EmptyState, SearchBar } from "@/components/reuseable";
import type { ICoupon } from "../types/coupon.types";
import CouponCard from "./CouponCard";
import CouponCardSkeleton from "./skeletons/CouponCardSkeleton";

import { FlatList } from "react-native";

interface ICouponsViewProps {
  coupons: ICoupon[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currencySymbol?: string;
}

export default function CouponsView({
  coupons,
  isLoading,
  searchQuery,
  setSearchQuery,
  currencySymbol,
}: Readonly<ICouponsViewProps>) {
  return (
    <FlatList
      data={isLoading ? [] : coupons}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-y-3"
      contentContainerStyle={{ paddingBottom: 80 }}
      scrollEnabled={false}
      ListHeaderComponent={
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by coupon name or code..."
        />
      }
      renderItem={({ item }) => (
        <CouponCard coupon={item} currencySymbol={currencySymbol} />
      )}
      ListEmptyComponent={
        isLoading ? (
          <CouponCardSkeleton count={3} />
        ) : (
          <EmptyState
            icon="card-membership"
            title="No Coupons Found"
            description={
              searchQuery
                ? "No coupons match your search criteria."
                : "There are no active coupons configured."
            }
          />
        )
      }
    />
  );
}
