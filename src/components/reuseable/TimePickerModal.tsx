// 1. React / React Native
import React from "react";

// 3. External libraries
import dayjs from "dayjs";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";

// ==================== TYPES ====================
export interface ITimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTime?: string; // hh:mm A or HH:mm format
  onSelectTime: (formattedTime: string) => void;
}

// ==================== COMPONENT ====================
export default function TimePickerModal({
  visible,
  onClose,
  selectedTime,
  onSelectTime,
}: Readonly<ITimePickerModalProps>) {
  const parsedDate = React.useMemo(() => {
    if (!selectedTime) return new Date();
    // Try parsing hh:mm A or HH:mm format on today's date
    const todayStr = dayjs().format("YYYY-MM-DD");
    const parsed = dayjs(`${todayStr} ${selectedTime}`, [
      "YYYY-MM-DD hh:mm A",
      "YYYY-MM-DD HH:mm",
    ]);
    return parsed.isValid() ? parsed.toDate() : new Date();
  }, [selectedTime]);

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="time"
      is24Hour={false}
      date={parsedDate}
      onConfirm={(date) => {
        onSelectTime(dayjs(date).format("hh:mm A"));
        onClose();
      }}
      onCancel={onClose}
      accentColor={COLORS.primary}
      buttonTextColorIOS={COLORS.primary}
    />
  );
}
