import BrandAlertModal, { BrandAlertConfig } from "@/components/reuseable/BrandAlertModal";
import { useData } from "@/context/context/DataContext";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { DriverOrder } from "../types";
import DriverActiveOrderCard from "./DriverActiveOrderCard";
import ExceptionModal, { ExceptionModalConfig } from "./ExceptionModal";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import HelpDrawer from "./HelpDrawer";

interface DriverActiveOrderProps {
  ordersList: DriverOrder[] | [];
  isLoading: boolean;
  updateStatusMutation: any;
  refetchActiveOrders: () => void;
}

const DriverActiveOrder: React.FC<DriverActiveOrderProps> = ({
  ordersList,
  isLoading,
  updateStatusMutation,
  refetchActiveOrders,
}: DriverActiveOrderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeDrawer, setActiveDrawer] = useState<"details" | "help" | null>(null);

  const { settings } = useData();
  const currencySymbol = React.useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const [exceptionModal, setExceptionModal] = useState<ExceptionModalConfig>({
    visible: false,
    orderId: null,
    title: "",
    reasons: [],
    type: null,
  });

  const [alertConfig, setAlertConfig] = useState<BrandAlertConfig>({
    visible: false,
    title: "",
    description: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    description: string,
    type: "info" | "success" | "error" | "confirm" = "info",
    onConfirm?: () => void,
    confirmText?: string,
    cancelText?: string,
  ) => {
    setAlertConfig({
      visible: true,
      title,
      description,
      type,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
    });
  };

  const triggerExceptionModal = (
    orderId: string | number,
    type: "failed" | "cancel" | "damaged",
    title: string,
    reasons: string[],
  ) => {
    setExceptionModal({
      visible: true,
      orderId,
      type,
      title,
      reasons,
    });
  };

  const handleExceptionSubmit = (reason: string, description?: string) => {
    if (!exceptionModal.orderId || !exceptionModal.type || updateStatusMutation.isPending) return;

    const orderId = exceptionModal.orderId;
    const type = exceptionModal.type;

    const statusMap = {
      failed: "failed",
      damaged: "failed",
      cancel: "cancel_requested",
    };

    const data = new FormData();
    data.append("status", statusMap[type] || "failed");
    data.append("failure_reason", reason);
    if (description) {
      data.append("failure_description", description);
    }

    updateStatusMutation.mutate(
      { orderId, formData: data },
      {
        onSuccess: (res: any) => {
          setExceptionModal((prev) => ({ ...prev, visible: false }));
          refetchActiveOrders();
          showAlert("Success", "Exception report submitted successfully", "success");
        },
        onError: (err: any) => {
          const errMsg = err?.data?.message || err?.message || "Failed to submit exception";
          showAlert("Error", errMsg, "error");
        },
      },
    );
  };

  const handleRetry = (orderId: string | number) => {
    const data = new FormData();
    data.append("status", "on_route");

    updateStatusMutation.mutate(
      { orderId, formData: data },
      {
        onSuccess: (res: any) => {
          refetchActiveOrders();
          showAlert("Success", "Delivery status reset to En Route", "success");
        },
        onError: (err: any) => {
          const errMsg = err?.data?.message || err?.message || "Failed to retry delivery";
          showAlert("Error", errMsg, "error");
        },
      },
    );
  };

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (containerWidth || 1));
    if (index >= 0 && index < ordersList.length) {
      setActiveIndex(index);
    }
  };

  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 p-4 rounded-lg flex-1">
        <DriverActiveOrderCard
          activeOrder={{} as any}
          isLoading={true}
          updateStatusMutation={updateStatusMutation}
          onOpenDetails={() => {}}
          onOpenHelp={() => {}}
        />
      </View>
    );
  }

  if (!ordersList || ordersList.length === 0) {
    return (
      <View key="empty" className="bg-base-300 p-4 rounded-lg flex-1 justify-center items-center py-10">
        <MaterialIcons name="inbox" size={48} color="#94a3b8" />
        <Text className="text-slate-400 font-semibold mt-2 capitalize">No active orders assigned</Text>
      </View>
    );
  }

  const activeOrder = ordersList[activeIndex];

  return (
    <View key="loaded" className="bg-base-300 p-4 rounded-lg flex-1">
      <View className="mb-2 flex-row items-start justify-between px-1">
        <Text className="font-bold capitalize opacity-80">Active Order</Text>
        <Text className="font-semibold capitalize opacity-30">
          {activeIndex + 1}/{ordersList.length}
        </Text>
      </View>
      <View className="flex-row items-start justify-between mb-4 px-1">
        <Text className="font-semibold capitalize text-sm opacity-50">OrderId</Text>
        <Text className="font-semibold capitalize text-sm opacity-30">{activeOrder?.id}</Text>
      </View>

      <View className="flex-1 w-full" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {containerWidth > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {ordersList.map((order) => (
              <View key={order.id} style={{ width: containerWidth }}>
                <DriverActiveOrderCard
                  activeOrder={order}
                  isLoading={false}
                  updateStatusMutation={updateStatusMutation}
                  refetchActiveOrders={refetchActiveOrders}
                  onOpenDetails={() => setActiveDrawer("details")}
                  onOpenHelp={() => setActiveDrawer("help")}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Slide-Up Drawers (Details / Help) */}
      <OrderDetailsDrawer
        order={activeDrawer === "details" ? activeOrder : null}
        visible={activeDrawer === "details"}
        onClose={() => setActiveDrawer(null)}
        currencySymbol={currencySymbol || "£"}
      />

      <HelpDrawer
        orderId={activeDrawer === "help" && activeOrder ? activeOrder.id : null}
        visible={activeDrawer === "help"}
        onClose={() => setActiveDrawer(null)}
        triggerExceptionModal={triggerExceptionModal}
        handleRetry={handleRetry}
      />

      {/* Exception Reason Modal Dialog */}
      <ExceptionModal
        visible={exceptionModal.visible}
        title={exceptionModal.title}
        reasons={exceptionModal.reasons}
        onClose={() => setExceptionModal((prev) => ({ ...prev, visible: false }))}
        onSubmit={handleExceptionSubmit}
        isLoading={updateStatusMutation.isPending}
      />

      <BrandAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm || (() => {})}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

DriverActiveOrder.displayName = "Driver Active Order";
export default DriverActiveOrder;
