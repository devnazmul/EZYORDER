// 1. React / React Native
import React from "react";

// 3. External libraries
import dayjs from "dayjs";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";

// ==================== TYPES ====================
export interface IDatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string; // YYYY-MM-DD format
  onSelectDate: (date: string) => void;
}

// ==================== COMPONENT ====================
export default function DatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}: Readonly<IDatePickerModalProps>) {
  const parsedDate =
    selectedDate && dayjs(selectedDate).isValid()
      ? dayjs(selectedDate).toDate()
      : new Date();

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="date"
      date={parsedDate}
      onConfirm={(date) => {
        onSelectDate(dayjs(date).format("YYYY-MM-DD"));
        onClose();
      }}
      onCancel={onClose}
      accentColor={COLORS.primary}
      buttonTextColorIOS={COLORS.primary}
    />
  );
}
