import { View } from "react-native";

import { CustomText } from "@/components/reuseable";

export function AuthHeader() {
  return (
    <View className="items-center my-4">
      <CustomText size="3xl" weight="bold" variant="primary">
        EZYORDER
      </CustomText>

      <CustomText size="lg" weight="medium" className="text-center">
        Manage your restaurant, anywhere
      </CustomText>
    </View>
  );
}
