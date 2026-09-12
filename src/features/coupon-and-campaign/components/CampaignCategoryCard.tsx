// 1. React / React Native
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. Shared components
import { CustomText } from "@/components/reuseable";

// 4. Feature utils
import type { ICampaignCategory } from "../utils/getCampaignCategoryConfig";

// 5. Constants/utils
import { COLORS } from "@/constants";

interface ICampaignCategoryCardProps {
  category: ICampaignCategory;
  onSelect: (value: string) => void;
}

export default function CampaignCategoryCard({
  category,
  onSelect,
}: Readonly<ICampaignCategoryCardProps>) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(category.value)}
      activeOpacity={0.7}
      className="bg-base-300 border border-base-200 rounded-lg p-5 flex-row items-center justify-between"
    >
      {/* Visual Icon Container */}
      <View
        className="w-12 h-12 rounded-lg items-center justify-center mr-4"
        style={{ backgroundColor: `${category.color}15` }}
      >
        <MaterialIcons name={category.icon} size={24} color={category.color} />
      </View>

      {/* Title & Description */}
      <View className="flex-1 mr-3">
        <CustomText variant="primary" size="sm" weight="bold">
          {category.name}
        </CustomText>
        <CustomText
          variant="tertiary"
          size="xs"
          weight="semibold"
          className="mt-1 leading-4"
        >
          {category.description}
        </CustomText>
      </View>

      {/* Chevron Link */}
      <MaterialIcons name="chevron-right" size={20} color={COLORS.accent} />
    </TouchableOpacity>
  );
}
