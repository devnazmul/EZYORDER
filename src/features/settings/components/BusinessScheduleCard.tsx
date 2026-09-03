// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components & constants
import { ActionCard, CustomText, StatusBadge } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { formatTime } from "@/utils";

// 6. Types
import { IBusinessDay } from "@/types";

export interface IBusinessScheduleCardProps {
  timing: IBusinessDay;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessScheduleCard({
  timing,
}: Readonly<IBusinessScheduleCardProps>) {
  const dayName = DAY_NAMES[timing.day] || `Day ${timing.day}`;
  const isClosed =
    timing.is_weekend === 1 ||
    !timing.time_slots ||
    timing.time_slots.length === 0;

  return (
    <ActionCard
      title={dayName}
      headerRight={<StatusBadge status={isClosed ? "inactive" : "active"} />}
      bodyClassName="p-4"
      containerClassName="mb-4"
    >
      {/* Time Slots display */}
      {isClosed ? (
        <View className="py-1 items-center justify-center">
          <CustomText
            variant="tertiary"
            size="xs"
            weight="semibold"
            className="italic text-center"
          >
            Not operating on this day
          </CustomText>
        </View>
      ) : (
        <View className="gap-y-2">
          {timing.time_slots?.map((slot, index) => (
            <View
              key={
                slot.id ? `slot-${slot.id}` : `slot-${index}-${slot.start_at}`
              }
              className="flex-row items-center justify-between bg-primary/5 p-2.5 rounded-lg"
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={COLORS.accent}
                />
                <CustomText variant="primary" size="xs" weight="bold">
                  Slot {index + 1}
                </CustomText>
              </View>
              <CustomText
                variant="primary"
                size="xs"
                weight="bold"
                style={{ color: COLORS.primary }}
              >
                {formatTime(slot.start_at)} — {formatTime(slot.end_at)}
              </CustomText>
            </View>
          ))}
        </View>
      )}
    </ActionCard>
  );
}
