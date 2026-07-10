import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface UserDetailModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    id: number | string;
    first_Name?: string;
    last_Name?: string;
    email: string;
    phone?: string;
    type?: string;
    image?: string;
    is_active?: boolean | number;
    last_login_at?: string;
    updated_at?: string;
  } | null;
}

export default function UserDetailModal({ visible, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  const fullName = `${user.first_Name || ""} ${user.last_Name || ""}`.trim() || "Staff Member";

  const initials = useMemo(() => {
    const first = user.first_Name ? user.first_Name[0] : "";
    const last = user.last_Name ? user.last_Name[0] : "";
    return `${first}${last}`.toUpperCase() || "SM";
  }, [user]);

  const isActive = user.is_active !== undefined ? !!user.is_active : true;

  const roleStyles = useMemo(() => {
    const type = (user.type || "").toLowerCase();
    switch (type) {
      case "admin":
      case "business_admin":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          label: "Admin",
          desc: "Full administrative access to manage menu products, configurations, and restaurant staff profiles.",
        };
      case "waiter":
        return {
          bg: "bg-secondary/10",
          text: "text-secondary",
          label: "Waiter",
          desc: "Access to the waiter station to view live tables, record guest seating, and track order service.",
        };
      case "driver":
        return {
          bg: "bg-accent/10",
          text: "text-accent",
          label: "Driver",
          desc: "Access to delivery modules, address maps, and order dispatch status logs.",
        };
      default:
        return {
          bg: "bg-base-200",
          text: "text-accent",
          label: user.type ? user.type.charAt(0).toUpperCase() + user.type.slice(1) : "Staff",
          desc: "Standard workspace privileges to inspect business summaries and view tables.",
        };
    }
  }, [user.type]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-neutral/55">
        <View className="bg-base-300 border-t border-base-200 rounded-t-3xl w-full p-6 shadow-2xl relative overflow-hidden gap-y-4 max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center border-b border-base-200 pb-3">
            <View className="gap-y-1">
              <Text className="text-base font-black text-neutral uppercase tracking-tight">
                Staff Details
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-base-100 active:bg-base-200">
              <MaterialIcons name="close" size={20} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Body */}
          <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
            {/* Centered Profile Avatar */}
            <View className="items-center mb-5 mt-2">
              <View className="w-20 h-20 rounded-full bg-base-200 items-center justify-center border-4 border-base-100 shadow-sm overflow-hidden mb-3">
                {user.image ? (
                  <Image source={{ uri: user.image }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Text className="text-2xl font-bold text-primary">{initials}</Text>
                )}
              </View>

              <Text className="text-base font-black text-neutral text-center" numberOfLines={2}>
                {fullName}
              </Text>

              <View className="flex-row items-center gap-1.5 mt-1.5">
                <View className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-neutral/40"}`} />
                <Text className="text-xs text-accent font-semibold">
                  {isActive ? "Active User" : "Inactive / Offline"}
                </Text>
              </View>
            </View>

            {/* Contact Details List */}
            <View className="gap-y-3 mb-4">
              <View className="flex-row items-center gap-3 bg-base-100 p-3 rounded-xl border border-base-200/50">
                <MaterialIcons name="mail-outline" size={18} color="#DC2D2A" />
                <Text className="text-xs text-neutral font-bold flex-1 select-all" numberOfLines={1}>
                  {user.email}
                </Text>
              </View>

              <View className="flex-row items-center gap-3 bg-base-100 p-3 rounded-xl border border-base-200/50">
                <MaterialIcons name="phone-iphone" size={18} color="#DC2D2A" />
                <Text className="text-xs text-neutral font-bold flex-1">
                  {user.phone || "No Phone Connected"}
                </Text>
              </View>
            </View>

            {/* Role details Section */}
            <View className="pt-4 border-t border-base-200/50 flex-row gap-3">
              <View
                className={`w-10 h-10 rounded-xl ${roleStyles.bg} items-center justify-center flex-shrink-0`}
              >
                <MaterialIcons
                  name="verified-user"
                  size={20}
                  color={
                    roleStyles.text === "text-primary"
                      ? "#DC2D2A"
                      : roleStyles.text === "text-secondary"
                        ? "#00677F"
                        : "#6E6E6E"
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-black text-neutral">Role: {roleStyles.label}</Text>
                <Text className="text-[10px] text-accent mt-0.5 leading-4 font-semibold">
                  {roleStyles.desc}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close Action Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-primary py-3.5 rounded-xl items-center mt-2 active:opacity-90 shadow-sm"
          >
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Close Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
