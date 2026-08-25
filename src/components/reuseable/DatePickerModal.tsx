// 1. React / React Native
import React, { useCallback, useMemo } from "react";

// 3. External libraries
import DateTimePickerModal from "react-native-modal-datetime-picker";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";

// ==================== TYPES ====================
export interface IDatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string; // YYYY-MM-DD format
  onSelectDate: (date: string) => void;
  title?: string;
}

// ==================== COMPONENT ====================
export default function DatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}: Readonly<IDatePickerModalProps>) {
  // Parse initial date or default to today
  const parsedDate = useMemo(() => {
    if (selectedDate && typeof selectedDate === "string") {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        const year = Number.parseInt(parts[0], 10);
        const month = Number.parseInt(parts[1], 10) - 1;
        const day = Number.parseInt(parts[2], 10);
        if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
          return new Date(year, month, day);
        }
      }
    }
    return new Date();
  }, [selectedDate]);

  const handleConfirm = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onSelectDate(formattedDate);
      onClose();
    },
    [onSelectDate, onClose],
  );

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="date"
      date={parsedDate}
      onConfirm={handleConfirm}
      onCancel={onClose}
      accentColor={COLORS.primary}
      buttonTextColorIOS={COLORS.primary}
    />
  );
}
