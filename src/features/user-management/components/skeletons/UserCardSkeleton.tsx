// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import {
  Bone,
  SkeletonContainer,
} from "@/components/reuseable/skeletons/Skeleton";

// 7. Constants/utils
import { WP } from "@/utils";

export default function UserCardSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        {/* Avatar Circle Skeleton */}
        <Bone width={WP(12)} height={WP(12)} circle={true} />

        {/* User Info Skeleton */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            {/* Full Name Skeleton */}
            <Bone width="45%" height={16} borderRadius={4} />
            {/* Role Badge Skeleton */}
            <Bone width={52} height={18} borderRadius={12} />
          </View>
          {/* Email Skeleton */}
          <Bone width="65%" height={12} borderRadius={4} className="mt-1.5" />
          {/* Phone Skeleton */}
          <Bone width="45%" height={12} borderRadius={4} className="mt-1" />
        </View>
      </View>
    </SkeletonContainer>
  );
}
