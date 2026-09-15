// 1. React / React Native
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { CustomText } from "@/components/reuseable";

// 5. Feature types
import type { IRestaurantPartner } from "../types/partners.types";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { WP } from "@/utils";

export interface IPartnerCardProps {
  item: IRestaurantPartner;
  onPress?: () => void;
}

export default function PartnerCard({
  item,
  onPress,
}: Readonly<IPartnerCardProps>) {
  const partnerName = item.restaurant_partner?.name;
  const contactPerson = item.contact_details?.contact_person;
  const contactNumber = item.contact_details?.contact_number;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={
        partnerName ? `Partner ${partnerName}` : "Partner Card"
      }
      className="bg-base-300 border border-base-300 rounded-2xl overflow-hidden"
      style={{ padding: WP("4%") }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="bg-primary/10 rounded-xl self-start"
          style={{ padding: WP("2.5%") }}
        >
          <MaterialIcons
            name="business"
            size={WP("6%")}
            color={COLORS.primary}
          />
        </View>

        <View className="flex-1 gap-y-1">
          <CustomText variant="primary" size="sm" weight="bold">
            {partnerName}
          </CustomText>

          {contactPerson ? (
            <View className="flex-row items-center gap-1">
              <CustomText variant="secondary" size="xs" weight="semibold">
                Contact Person:
              </CustomText>
              <CustomText variant="primary" size="xs" weight="semibold">
                {contactPerson}
              </CustomText>
            </View>
          ) : null}

          {contactNumber ? (
            <View className="flex-row items-center gap-1">
              <CustomText variant="secondary" size="xs" weight="semibold">
                Contact Number:
              </CustomText>
              <CustomText
                variant="primary"
                size="xs"
                weight="semibold"
                type="phone"
              >
                {contactNumber}
              </CustomText>
            </View>
          ) : null}
        </View>

        <MaterialIcons
          name="chevron-right"
          size={WP("5.5%")}
          color={COLORS.accent}
          style={{ opacity: 0.85 }}
        />
      </View>
    </TouchableOpacity>
  );
}
