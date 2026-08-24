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

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

// ==================== TYPES ====================

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IDropdownProps {
  options: IDropdownOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
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
  placeholder = "Select",
  triggerClassName = "",
  triggerTextClassName = "",
}: Readonly<IDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<IDropdownCoords | null>(null);

  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  const activeVal = selectedValue || options[0]?.value;
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayLabel =
    selectedOption?.label || options[0]?.label || placeholder;

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

  const handleSelect = (val: string) => {
    onSelect?.(val);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef as any}
        onPress={handleOpen}
        activeOpacity={0.75}
        className={`flex-row items-center bg-base-200 border border-base-200 px-3 py-1.5 rounded-lg ${triggerClassName}`}
      >
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className={`font-semibold text-neutral mr-1 capitalize ${triggerTextClassName}`}
        >
          {displayLabel}
        </Text>
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
                  const isSelected = option.value === activeVal;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleSelect(option.value)}
                      className={`flex-row items-center justify-between px-3.5 py-2.5 ${
                        isSelected ? "bg-primary/10" : "bg-transparent"
                      }`}
                    >
                      <Text
                        style={{ fontSize: getResponsiveFontSize("xs") }}
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
