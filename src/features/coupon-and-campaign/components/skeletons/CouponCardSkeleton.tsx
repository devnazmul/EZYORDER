// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";

export interface ICouponCardSkeletonProps {
  count?: number;
}

export default function CouponCardSkeleton({
  count = 3,
}: Readonly<ICouponCardSkeletonProps>) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-3">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-xl mb-1 shadow-sm flex-row min-h-[120px]"
        >
          {/* Left Ticket Part */}
          <View className="bg-primary/5 items-center justify-center p-3 sm:p-4 w-[100px] sm:w-[120px] border-r border-dashed border-base-200 relative overflow-hidden rounded-l-xl gap-y-2">
            <Bone width={65} height={20} borderRadius={4} />
            <Bone width={45} height={12} borderRadius={4} />
          </View>

          {/* Right Ticket Part */}
          <View className="flex-1 p-3 sm:p-4 justify-between">
            <View>
              {/* Top Row: Title & Share Button */}
              <View className="flex-row justify-between items-start mb-1.5 gap-2">
                <Bone width="65%" height={16} borderRadius={4} />
                <Bone width={22} height={22} borderRadius={4} />
              </View>

              {/* Row 2: Status Badge */}
              <View className="flex-row items-center mb-1.5">
                <Bone width={55} height={18} borderRadius={9999} />
              </View>

              {/* Row 3: Redemptions */}
              <View className="flex-row items-center mb-1.5">
                <Bone width={110} height={12} borderRadius={4} />
              </View>

              {/* Row 4: Dates */}
              <View className="flex-row items-center mb-1.5">
                <Bone width={130} height={12} borderRadius={4} />
              </View>
            </View>

            {/* Bottom Right: Copy Button / Auto Applies */}
            <View className="flex-row items-center justify-end pt-2 border-t border-base-100 mt-2">
              <Bone width={80} height={26} borderRadius={8} />
            </View>
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
