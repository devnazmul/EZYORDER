// 1. React / React Native
import React, { useRef, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import Badge from "./Badge";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { toggleMultiSelectValue } from "@/utils/toggleMultiSelectValue";

// ==================== TYPES ====================

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IDropdownProps {
  options: IDropdownOption[];
  selectedValue?: string | string[];
  onSelect?: (value: string | string[]) => void;
  isMultiSelect?: boolean;
  placeholder?: string;
  triggerClassName?: string;
  triggerTextClassName?: string;
}

interface IDropdownCoords {
  top: number;
  right: number;
  minWidth: number;
}

// ==================== MAIN COMPONENT ====================

export default function Dropdown({
  options,
  selectedValue,
  onSelect,
  isMultiSelect = false,
  placeholder = "Select",
  triggerClassName = "",
  triggerTextClassName = "",
}: Readonly<IDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<IDropdownCoords | null>(null);

  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();
  const fontSize = getResponsiveFontSize("xs");

  // Normalize selected values into array if multi-select, or single string
  let selectedArray: string[] = [];
  if (Array.isArray(selectedValue)) {
    selectedArray = selectedValue;
  } else if (typeof selectedValue === "string" && selectedValue) {
    selectedArray = [selectedValue];
  }

  const activeSingleValue = isMultiSelect
    ? ""
    : (selectedValue as string) || options[0]?.value;

  const isOptionSelected = (val: string): boolean => {
    if (isMultiSelect) {
      if (val === "all") {
        return selectedArray.length === 0 || selectedArray.includes("all");
      }
      return selectedArray.includes(val);
    }
    return val === activeSingleValue;
  };

  const isAllSelected = isOptionSelected("all");

  const selectedOptions = isMultiSelect
    ? options.filter(
        (opt) => opt.value !== "all" && selectedArray.includes(opt.value),
      )
    : [];

  let displayLabel: string | null = null;
  if (!isMultiSelect) {
    const selectedOption = options.find(
      (opt) => opt.value === activeSingleValue,
    );
    displayLabel = selectedOption?.label || options[0]?.label || placeholder;
  } else if (isAllSelected || selectedOptions.length === 0) {
    displayLabel =
      options.find((opt) => opt.value === "all")?.label || placeholder;
  }

  const handleOpen = () => {
    if (triggerRef.current) {
      triggerRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setCoords({
            top: y + height + 4,
            right: Math.max(12, windowWidth - (x + width)),
            minWidth: Math.max(width, 130),
          });
          setIsOpen(true);
        },
      );
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectOption = (val: string) => {
    if (!isMultiSelect) {
      onSelect?.(val);
      setIsOpen(false);
      return;
    }

    const next = toggleMultiSelectValue(selectedArray, val);
    onSelect?.(next);
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        onPress={handleOpen}
        activeOpacity={0.75}
        className={`flex-row items-center border border-base-200 px-3 py-2 rounded-lg ${
          triggerClassName.includes("bg-")
            ? triggerClassName
            : `bg-base-200 ${triggerClassName}`
        }`}
      >
        {isMultiSelect && !isAllSelected && selectedOptions.length > 0 ? (
          <View className="flex-row flex-wrap items-center gap-1.5 flex-1 mr-2 py-0.5">
            {selectedOptions.map((opt) => (
              <Badge
                key={opt.value}
                text={opt.label}
                containerClassName="bg-primary rounded-lg border border-primary/20 px-2.5 py-1"
                textClassName="text-white font-bold"
                iconPosition="right"
                icon={
                  <TouchableOpacity
                    onPress={() => handleSelectOption(opt.value)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <MaterialIcons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                }
              />
            ))}
          </View>
        ) : (
          <Text
            style={{ fontSize }}
            className={`font-semibold text-neutral mr-1 capitalize ${triggerTextClassName}`}
          >
            {displayLabel}
          </Text>
        )}

        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={WP("4%")}
          color={COLORS.accent}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className="flex-1 bg-transparent">
            {coords ? (
              <View
                style={{
                  position: "absolute",
                  top: coords.top,
                  right: coords.right,
                  minWidth: coords.minWidth,
                }}
                className="bg-base-300 rounded-xl border border-base-200 shadow-xl py-1 z-50 overflow-hidden"
              >
                {options.map((option) => {
                  const isSelected = isOptionSelected(option.value);

                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleSelectOption(option.value)}
                      className={`flex-row items-center justify-between px-3.5 py-2.5 ${
                        isSelected ? "bg-primary/10" : "bg-transparent"
                      }`}
                    >
                      <Text
                        style={{ fontSize }}
                        className={`font-semibold capitalize mr-3 ${
                          isSelected ? "text-primary font-bold" : "text-neutral"
                        }`}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons
                          name="check"
                          size={WP("3.5%")}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
