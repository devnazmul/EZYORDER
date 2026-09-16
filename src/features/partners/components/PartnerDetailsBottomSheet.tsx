// 1. React / React Native
import { View } from "react-native";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// 4. Shared components
import {
  BottomSheet,
  BottomSheetCard,
  CustomText,
} from "@/components/reuseable";

// 5. Feature types
import type { IRestaurantPartner } from "../types/partners.types";

// 7. Constants/utils
import { getOrderTypeConfig, HP, WP } from "@/utils";

export interface IPartnerDetailsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  partner: IRestaurantPartner | null;
}

export default function PartnerDetailsBottomSheet({
  visible,
  onClose,
  partner,
}: Readonly<IPartnerDetailsBottomSheetProps>) {
  if (!partner) return null;

  const partnerName = partner.restaurant_partner?.name || "Partner";

  const eatInConfig = getOrderTypeConfig("eat_in");
  const deliveryConfig = getOrderTypeConfig("delivery");
  const takeawayConfig = getOrderTypeConfig("take_away");

  const channels = [
    {
      key: "eat_in",
      title: eatInConfig.label,
      icon: eatInConfig.icon,
      enabled: partner.eat_in !== 0,
      commission: partner.eat_in_order_commission,
      link: partner.eat_in_shop_link,
    },
    {
      key: "delivery",
      title: deliveryConfig.label,
      icon: deliveryConfig.icon,
      enabled: partner.delivery !== 0,
      commission: partner.delivery_order_commission,
      link: partner.delivery_shop_link,
    },
    {
      key: "takeaway",
      title: takeawayConfig.label,
      icon: takeawayConfig.icon,
      enabled: partner.takeaway !== 0,
      commission: partner.takeaway_order_commission,
      link: partner.takeaway_link,
    },
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["65%", "90%"]}
    >
      {/* Drawer Header */}
      <View
        style={{ paddingHorizontal: WP("6%") }}
        className="flex-row justify-between items-center border-b border-base-200 pb-3 pt-2"
      >
        <View className="flex-row items-center gap-3">
          <View>
            <CustomText variant="primary" size="md" weight="bold">
              {partnerName}
            </CustomText>
            <CustomText
              variant="tertiary"
              size="xs"
              weight="medium"
              className="mt-0.5"
            >
              Details about partner {partnerName}
            </CustomText>
          </View>
        </View>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: WP("6%"),
          paddingTop: 16,
          paddingBottom: HP("3%"),
        }}
      >
        <View className="gap-y-4">
          {/* Channel Commission Cards */}
          {channels
            .filter((channel) => channel.enabled)
            .map((channel) => (
              <BottomSheetCard
                key={channel.key}
                icon={channel.icon}
                title={channel.title}
              >
                {/* Commission Details */}
                <View className="flex-row items-center justify-between">
                  <CustomText variant="secondary" size="xs" weight="semibold">
                    Order Commission
                  </CustomText>
                  <CustomText variant="primary" size="sm" weight="semibold">
                    {channel.commission ? `${channel.commission}%` : "0%"}
                  </CustomText>
                </View>

                {/* Shop Link */}
                {channel.link ? (
                  <View className="flex-row items-center justify-between">
                    <CustomText variant="secondary" size="xs" weight="semibold">
                      Website Link
                    </CustomText>
                    <CustomText
                      type="link"
                      size="xs"
                      weight="semibold"
                      numberOfLines={1}
                    >
                      {channel.link}
                    </CustomText>
                  </View>
                ) : null}
              </BottomSheetCard>
            ))}

          {/* Payment Terms Section */}
          {partner.payment_terms ? (
            <BottomSheetCard icon="payments" title="Payment Terms">
              <CustomText
                variant="secondary"
                size="xs"
                weight="normal"
                className="leading-5 bg-base-200/60 p-3 rounded-xl border border-base-300/50"
              >
                {partner.payment_terms}
              </CustomText>
            </BottomSheetCard>
          ) : null}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
