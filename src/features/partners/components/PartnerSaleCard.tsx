// 1. React / React Native
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components & context
import { CustomText } from "@/components/reuseable";
import { useAuth } from "@/context/AuthContext";

// 5. Feature types
import type { IDailyOrderPartnerSale } from "../types/partners.types";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { formatAmount, getCurrencySymbol, WP } from "@/utils";

export interface IPartnerSaleCardProps {
  item: IDailyOrderPartnerSale;
  onPress?: () => void;
}

export default function PartnerSaleCard({
  item,
  onPress,
}: Readonly<IPartnerSaleCardProps>) {
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.restaurant?.[0]?.currency);
  const partnerName = item.restaurant_partner?.name;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={
        partnerName ? `Partner sale ${partnerName}` : "Partner Sale Card"
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
            name="trending-up"
            size={WP("6%")}
            color={COLORS.primary}
          />
        </View>

        <View className="flex-1 gap-y-1">
          <CustomText variant="primary" size="sm" weight="bold">
            {partnerName}
          </CustomText>

          {item.bank_payment || item.cash_payment ? (
            <View className="flex-row items-center gap-3">
              {item.bank_payment ? (
                <View className="flex-row items-center gap-1">
                  <CustomText variant="secondary" size="xs" weight="semibold">
                    Bank:
                  </CustomText>
                  <CustomText
                    variant="brand-primary"
                    size="xs"
                    weight="semibold"
                  >
                    {formatAmount(item.bank_payment, currencySymbol)}
                  </CustomText>
                </View>
              ) : null}

              {item.cash_payment ? (
                <View className="flex-row items-center gap-1">
                  <CustomText variant="secondary" size="xs" weight="semibold">
                    Cash:
                  </CustomText>
                  <CustomText
                    variant="brand-primary"
                    size="xs"
                    weight="semibold"
                  >
                    {formatAmount(item.cash_payment, currencySymbol)}
                  </CustomText>
                </View>
              ) : null}
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
