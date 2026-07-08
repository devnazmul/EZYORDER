import FilterChips from "@/components/reuseable/FilterChips";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePickerModal from "./DatePickerModal";

export interface FilterField {
  id: string;
  label: string;
  type: "chips" | "date-range" | "number-range" | "text" | "date";
  options?: { id: string; label: string }[]; // For chips type
}

interface FilterDrawerProps {
  fields: FilterField[];
  values: Record<string, any>;
  onApply: (values: Record<string, any>) => void;
  onClear: () => void;
  triggerClassName?: string;
}

export default function FilterDrawer({
  fields,
  values,
  onApply,
  onClear,
  triggerClassName = "",
}: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Local scratch state to modify before applying
  const [localValues, setLocalValues] = useState<Record<string, any>>(values);
  const [activeDatePicker, setActiveDatePicker] = useState<{
    fieldId: string;
    type: "start" | "end" | "single";
  } | null>(null);

  // Sync local values when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalValues(values);
    }
  }, [isOpen, values]);

  // Compute active filter count dynamically
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (val === "all") return;
      if (typeof val === "object" && val !== null) {
        if (val.start || val.end || val.min || val.max) count++;
      } else if (val) {
        count++;
      }
    });
    return count;
  }, [values]);

  const handleChipSelect = (fieldId: string, optionId: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldId]: optionId,
    }));
  };

  const handleDateSelect = (dateStr: string) => {
    if (!activeDatePicker) return;
    const { fieldId, type } = activeDatePicker;

    if (type === "single") {
      setLocalValues((prev) => ({
        ...prev,
        [fieldId]: dateStr,
      }));
    } else {
      setLocalValues((prev) => {
        const currentRange = prev[fieldId] || { start: "", end: "" };
        return {
          ...prev,
          [fieldId]: {
            ...currentRange,
            [type]: dateStr,
          },
        };
      });
    }
    setActiveDatePicker(null);
  };

  const handleClear = () => {
    const cleared: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "chips") {
        cleared[f.id] = "all";
      } else if (f.type === "date-range") {
        cleared[f.id] = { start: "", end: "" };
      } else if (f.type === "number-range") {
        cleared[f.id] = { min: "", max: "" };
      } else if (f.type === "text") {
        cleared[f.id] = "";
      } else if (f.type === "date") {
        cleared[f.id] = "";
      }
    });
    setLocalValues(cleared);
    onClear();
  };

  const handleApply = () => {
    onApply(localValues);
    setIsOpen(false);
  };

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "Select Date";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    } catch {}
    return dateStr;
  };

  return (
    <>
      {/* Reusable Trigger Button rendered inside component */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        className={`relative bg-base-300 border border-base-200 rounded-lg p-2.5 items-center justify-center ${triggerClassName}`}
      >
        <MaterialIcons name="filter-list" size={20} color="#DC2D2A" />
        {activeFilterCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full items-center justify-center border-2 border-base-300">
            <Text className="text-[8px] font-bold text-white">{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <View className="flex-1 justify-end bg-neutral/40">
          <View className="bg-base-300 border-t border-base-200 rounded-t-3xl h-[80%] flex-col">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-base-200">
              <Text className="text-base font-black text-neutral uppercase tracking-tight">Filters</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)} className="p-1">
                <MaterialIcons name="close" size={24} color="#6E6E6E" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Fields */}
            <ScrollView className="flex-1 px-5 py-4">
              <View className="gap-y-6 pb-8">
                {fields.map((field) => {
                  if (field.type === "chips" && field.options) {
                    const selectedId = localValues[field.id] || "all";
                    return (
                      <View key={field.id}>
                        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                          {field.label}
                        </Text>
                        <FilterChips
                          chips={field.options}
                          selectedId={selectedId}
                          onSelect={(optionId) => handleChipSelect(field.id, optionId)}
                        />
                      </View>
                    );
                  }

                  if (field.type === "date-range") {
                    const range = localValues[field.id] || { start: "", end: "" };
                    return (
                      <View key={field.id}>
                        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                          {field.label}
                        </Text>
                        <View className="flex-row items-center gap-3">
                          {/* Start Date */}
                          <TouchableOpacity
                            onPress={() => setActiveDatePicker({ fieldId: field.id, type: "start" })}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
                          >
                            <View>
                              <Text className="text-[8px] font-bold text-accent uppercase">Start Date</Text>
                              <Text className="text-xs font-semibold text-neutral mt-0.5">
                                {formatDateLabel(range.start)}
                              </Text>
                            </View>
                            <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
                          </TouchableOpacity>

                          {/* End Date */}
                          <TouchableOpacity
                            onPress={() => setActiveDatePicker({ fieldId: field.id, type: "end" })}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
                          >
                            <View>
                              <Text className="text-[8px] font-bold text-accent uppercase">End Date</Text>
                              <Text className="text-xs font-semibold text-neutral mt-0.5">
                                {formatDateLabel(range.end)}
                              </Text>
                            </View>
                            <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }

                  if (field.type === "number-range") {
                    const range = localValues[field.id] || { min: "", max: "" };
                    return (
                      <View key={field.id}>
                        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                          {field.label}
                        </Text>
                        <View className="flex-row items-center gap-3">
                          {/* Min Amount */}
                          <View className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3">
                            <View className="flex-1">
                              <Text className="text-[8px] font-bold text-accent uppercase">Min Amount</Text>
                              <TextInput
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#6E6E6E"
                                value={range.min}
                                onChangeText={(text) => {
                                  setLocalValues((prev) => ({
                                    ...prev,
                                    [field.id]: {
                                      ...(prev[field.id] || { min: "", max: "" }),
                                      min: text,
                                    },
                                  }));
                                }}
                                className="text-xs font-semibold text-neutral mt-0.5 p-0"
                              />
                            </View>
                          </View>

                          {/* Max Amount */}
                          <View className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3">
                            <View className="flex-1">
                              <Text className="text-[8px] font-bold text-accent uppercase">Max Amount</Text>
                              <TextInput
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#6E6E6E"
                                value={range.max}
                                onChangeText={(text) => {
                                  setLocalValues((prev) => ({
                                    ...prev,
                                    [field.id]: {
                                      ...(prev[field.id] || { min: "", max: "" }),
                                      max: text,
                                    },
                                  }));
                                }}
                                className="text-xs font-semibold text-neutral mt-0.5 p-0"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }

                  if (field.type === "text") {
                    const textVal = localValues[field.id] || "";
                    return (
                      <View key={field.id}>
                        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                          {field.label}
                        </Text>
                        <View className="bg-base-100 border border-base-200 rounded-xl p-3">
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Enter value..."
                            placeholderTextColor="#6E6E6E"
                            value={textVal}
                            onChangeText={(text) => {
                              setLocalValues((prev) => ({
                                ...prev,
                                [field.id]: text,
                              }));
                            }}
                            className="text-xs font-semibold text-neutral p-0"
                          />
                        </View>
                      </View>
                    );
                  }

                  if (field.type === "date") {
                    const dateVal = localValues[field.id] || "";
                    return (
                      <View key={field.id}>
                        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                          {field.label}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setActiveDatePicker({ fieldId: field.id, type: "single" })}
                          activeOpacity={0.8}
                          className="flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
                        >
                          <View>
                            <Text className="text-[8px] font-bold text-accent uppercase">Selected Date</Text>
                            <Text className="text-xs font-semibold text-neutral mt-0.5">
                              {formatDateLabel(dateVal)}
                            </Text>
                          </View>
                          <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
                        </TouchableOpacity>
                      </View>
                    );
                  }

                  return null;
                })}
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="flex-row items-center gap-3 p-4 border-t border-base-200 bg-base-200">
              <TouchableOpacity
                onPress={handleClear}
                activeOpacity={0.8}
                className="flex-1 border border-accent py-3.5 rounded-xl items-center justify-center bg-base-300"
              >
                <Text className="text-xs font-bold text-accent uppercase tracking-wider">Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                activeOpacity={0.8}
                className="flex-1 bg-primary py-3.5 rounded-xl items-center justify-center"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-wider">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Embedded Date Picker Modal */}
      {activeDatePicker && (
        <DatePickerModal
          visible={true}
          onClose={() => setActiveDatePicker(null)}
          title={`Select Date`}
          selectedDate={localValues[activeDatePicker.fieldId]}
          onSelectDate={handleDateSelect}
        />
      )}
    </>
  );
}
