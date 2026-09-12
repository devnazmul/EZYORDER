// 1. React / React Native
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. Shared components / context / hooks
import { CustomText } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { WP } from "@/utils";

interface ICampaignCategoryHeaderProps {
  categoryName?: string;
  onBack: () => void;
}

export default function CampaignCategoryHeader({
  categoryName,
  onBack,
}: Readonly<ICampaignCategoryHeaderProps>) {
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <TouchableOpacity onPress={onBack} className="bg-base-200 p-2 rounded-lg">
        <MaterialIcons name="arrow-back" size={WP(4)} color={COLORS.primary} />
      </TouchableOpacity>
      <View className="flex-1">
        <CustomText variant="tertiary" size="xs" weight="semibold">
          Campaign Category
        </CustomText>
        <CustomText variant="primary" size="sm" weight="bold" numberOfLines={1}>
          {categoryName}
        </CustomText>
      </View>
    </View>
  );
}
