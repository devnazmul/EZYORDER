import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string; // YYYY-MM-DD format
  onSelectDate: (date: string) => void;
  title?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  title = "Select Date",
}: DatePickerModalProps) {
  // Parse initial state date or default to today
  const initialDate = useMemo(() => {
    if (selectedDate) {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    return new Date();
  }, [selectedDate]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [mode, setMode] = useState<"calendar" | "month" | "year">("calendar");

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const days: (number | null)[] = [];

    // Empty spots for days of previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentYear, currentMonth]);

  // Generate dynamic year list (e.g. from 2020 to 2035)
  const years = useMemo(() => {
    const startYear = 2020;
    const endYear = 2035;
    const list = [];
    for (let y = startYear; y <= endYear; y++) {
      list.push(y);
    }
    return list;
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onSelectDate(dateStr);
    onClose();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    // Support comparing both YYYY-MM-DD or formatting mismatch
    return selectedDate === dateStr;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-neutral/40 px-4">
        <View className="bg-base-300 border border-base-200 rounded-3xl w-full max-w-[340px] p-5 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-bold text-neutral">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={20} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          {/* Month/Year selector */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={handlePrevMonth} className="p-1 rounded-full bg-base-100">
              <MaterialIcons name="chevron-left" size={20} color="#000000" />
            </TouchableOpacity>
            <View className="flex-row gap-2 items-center">
              <TouchableOpacity
                onPress={() => setMode((prev) => (prev === "month" ? "calendar" : "month"))}
                className={`px-2 py-1 rounded-md ${mode === "month" ? "bg-primary" : ""}`}
              >
                <Text
                  className={`text-xs font-bold ${
                    mode === "month" ? "text-white" : "text-neutral"
                  }`}
                >
                  {MONTHS[currentMonth]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode((prev) => (prev === "year" ? "calendar" : "year"))}
                className={`px-2 py-1 rounded-md ${mode === "year" ? "bg-primary" : ""}`}
              >
                <Text
                  className={`text-xs font-bold ${
                    mode === "year" ? "text-white" : "text-neutral"
                  }`}
                >
                  {currentYear}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleNextMonth} className="p-1 rounded-full bg-base-100">
              <MaterialIcons name="chevron-right" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          {mode === "calendar" && (
            <>
              {/* Calendar Day Labels */}
              <View className="flex-row mb-2">
                {DAYS_OF_WEEK.map((day, idx) => (
                  <Text key={idx} className="flex-1 text-center text-[10px] font-bold text-accent">
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <View key={idx} className="w-[14.28%] aspect-square" />;
                  }

                  const selected = isSelected(day);

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleDaySelect(day)}
                      className={`w-[14.28%] aspect-square justify-center items-center rounded-lg ${
                        selected ? "bg-primary" : "active:bg-base-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          selected ? "text-white" : "text-neutral"
                        }`}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {mode === "month" && (
            <View className="flex-row flex-wrap gap-2 justify-center py-2">
              {MONTHS.map((m, idx) => {
                const isSelectedMonth = idx === currentMonth;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setCurrentMonth(idx);
                      setMode("calendar");
                    }}
                    className={`px-3 py-2 rounded-lg min-w-[28%] items-center justify-center ${
                      isSelectedMonth ? "bg-primary" : "bg-base-100 active:bg-base-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelectedMonth ? "text-white" : "text-neutral"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {mode === "year" && (
            <ScrollView
              style={{ maxHeight: 200 }}
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                paddingVertical: 8,
              }}
            >
              {years.map((y) => {
                const isSelectedYear = y === currentYear;
                return (
                  <TouchableOpacity
                    key={y}
                    onPress={() => {
                      setCurrentYear(y);
                      setMode("calendar");
                    }}
                    className={`px-3 py-2 rounded-lg min-w-[28%] items-center justify-center ${
                      isSelectedYear ? "bg-primary" : "bg-base-100 active:bg-base-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelectedYear ? "text-white" : "text-neutral"
                      }`}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
