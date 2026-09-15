// 1. React / React Native
import { View } from "react-native";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// 4. Shared components & context
import {
  BottomSheet,
  BottomSheetCard,
  CustomText,
} from "@/components/reuseable";
import { useAuth } from "@/context/AuthContext";

// 5. Feature types
import type { IDailyOrderPartnerSale } from "../types/partners.types";

// 7. Constants/utils
import {
  formatAmount,
  getCurrencySymbol,
  getOrderTypeConfig,
  HP,
  WP,
} from "@/utils";

export interface IPartnerSaleDetailsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  sale: IDailyOrderPartnerSale | null;
}

export default function PartnerSaleDetailsBottomSheet({
  visible,
  onClose,
  sale,
}: Readonly<IPartnerSaleDetailsBottomSheetProps>) {
  const { user } = useAuth();
  if (!sale) return null;

  const currencySymbol = getCurrencySymbol(user?.restaurant?.[0]?.currency);
  const partnerName = sale.restaurant_partner?.name || "Partner Sale";

  const eatInConfig = getOrderTypeConfig("eat_in");
  const deliveryConfig = getOrderTypeConfig("delivery");
  const takeawayConfig = getOrderTypeConfig("take_away");

  const channels = [
    {
      key: "eat_in",
      title: eatInConfig.label,
      icon: eatInConfig.icon,
      orders: sale.eat_in_orders,
      amount: sale.eat_in_orders_amount,
    },
    {
      key: "delivery",
      title: deliveryConfig.label,
      icon: deliveryConfig.icon,
      orders: sale.delivery_orders,
      amount: sale.delivery_orders_amount,
    },
    {
      key: "takeaway",
      title: takeawayConfig.label,
      icon: takeawayConfig.icon,
      orders: sale.takeaway_orders,
      amount: sale.takeaway_orders_amount,
    },
  ];

  const activeChannels = channels.filter((channel) => channel.orders > 0);

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
              Order Sales Details
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
        <View className="gap-y-3">
          {/* Active Channel Order Breakdown */}
          {activeChannels.map((channel) => (
            <BottomSheetCard
              key={channel.key}
              icon={channel.icon}
              title={channel.title}
            >
              <View className="flex-row items-center justify-between">
                <CustomText variant="secondary" size="xs" weight="semibold">
                  Orders Count
                </CustomText>
                <CustomText variant="primary" size="sm" weight="semibold">
                  {channel.orders} {channel.orders === 1 ? "Order" : "Orders"}
                </CustomText>
              </View>

              <View className="flex-row items-center justify-between">
                <CustomText variant="secondary" size="xs" weight="semibold">
                  Order Value
                </CustomText>
                <CustomText variant="brand-primary" size="sm" weight="semibold">
                  {formatAmount(channel.amount, currencySymbol)}
                </CustomText>
              </View>
            </BottomSheetCard>
          ))}

          {/* Payment Breakdown Section */}
          {sale.bank_payment || sale.cash_payment ? (
            <BottomSheetCard icon="payments" title="Payment Breakdown">
              {sale.bank_payment ? (
                <View className="flex-row items-center justify-between">
                  <CustomText variant="secondary" size="xs" weight="semibold">
                    Bank Payment
                  </CustomText>
                  <CustomText
                    variant="brand-primary"
                    size="sm"
                    weight="semibold"
                  >
                    {formatAmount(sale.bank_payment, currencySymbol)}
                  </CustomText>
                </View>
              ) : null}

              {sale.cash_payment ? (
                <View className="flex-row items-center justify-between">
                  <CustomText variant="secondary" size="xs" weight="semibold">
                    Cash Payment
                  </CustomText>
                  <CustomText
                    variant="brand-primary"
                    size="sm"
                    weight="semibold"
                  >
                    {formatAmount(sale.cash_payment, currencySymbol)}
                  </CustomText>
                </View>
              ) : null}
            </BottomSheetCard>
          ) : null}

          {/* Notes Section */}
          {sale.notes && sale.notes.trim() !== "" ? (
            <BottomSheetCard icon="notes" title="Notes">
              <CustomText
                variant="secondary"
                size="xs"
                weight="normal"
                className="leading-5 bg-base-200/60 p-3 rounded-xl border border-base-300/50"
              >
                {sale.notes}
              </CustomText>
            </BottomSheetCard>
          ) : null}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
