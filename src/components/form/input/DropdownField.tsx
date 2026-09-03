// 1. React / React Native
import React, { useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import Badge from "@/components/reuseable/Badge";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { toggleMultiSelectValue } from "@/utils/toggleMultiSelectValue";
import { handleFieldSideEffects } from "./handleFieldSideEffects";

// ==================== TYPES ====================

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IDropdownFieldProps {
  readonly name?: string;
  readonly label?: string;
  readonly options?: { id: string; label: string }[];
  readonly dropdownOptions?: IDropdownOption[];
  readonly selectedValue?: string | string[];
  readonly onSelect?: (value: string | string[]) => void;
  readonly isMultiSelect?: boolean;
  readonly placeholder?: string;
  readonly triggerClassName?: string;
  readonly triggerTextClassName?: string;
  readonly className?: string;
  readonly maxHeight?: number;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

interface IDropdownCoords {
  top: number;
  right: number;
  minWidth: number;
}

// ==================== HELPER PRESENTATIONAL VIEW ====================

function DropdownView({
  label,
  formattedOptions,
  selectedValue,
  isMultiSelect,
  placeholder,
  triggerClassName,
  triggerTextClassName,
  className,
  maxHeight = 240,
  errorMessage,
  onSelectOption,
}: Readonly<{
  label?: string;
  formattedOptions: IDropdownOption[];
  selectedValue?: string | string[];
  isMultiSelect?: boolean;
  placeholder: string;
  triggerClassName: string;
  triggerTextClassName: string;
  className: string;
  maxHeight?: number;
  errorMessage?: string;
  onSelectOption: (val: string) => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<IDropdownCoords | null>(null);

  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();
  const fontSize = getResponsiveFontSize("xs");

  let selectedArray: string[] = [];
  if (Array.isArray(selectedValue)) {
    selectedArray = selectedValue;
  } else if (typeof selectedValue === "string" && selectedValue) {
    selectedArray = [selectedValue];
  }

  const activeSingleValue = isMultiSelect
    ? ""
    : (selectedValue as string) || formattedOptions[0]?.value || "";

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
    ? formattedOptions.filter(
        (opt) => opt.value !== "all" && selectedArray.includes(opt.value),
      )
    : [];

  let displayLabel: string | null = null;
  if (!isMultiSelect) {
    const selectedOption = formattedOptions.find(
      (opt) => opt.value === activeSingleValue,
    );
    displayLabel =
      selectedOption?.label || formattedOptions[0]?.label || placeholder;
  } else if (isAllSelected || selectedOptions.length === 0) {
    displayLabel =
      formattedOptions.find((opt) => opt.value === "all")?.label || placeholder;
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

  const handleSelect = (val: string) => {
    if (!isMultiSelect) {
      setIsOpen(false);
    }
    onSelectOption(val);
  };

  return (
    <View className={className || "w-full"}>
      <InputLabel label={label} className="capitalize mb-3" />

      <TouchableOpacity
        ref={triggerRef}
        onPress={handleOpen}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`${label || placeholder}: ${displayLabel || ""}`}
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
                    onPress={() => handleSelect(opt.value)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${opt.label}`}
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

      {Boolean(errorMessage) && (
        <InputError errorMessage={errorMessage || ""} />
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className="flex-1 bg-transparent">
            {Boolean(coords) && (
              <View
                style={{
                  position: "absolute",
                  top: coords?.top,
                  right: coords?.right,
                  minWidth: coords?.minWidth,
                  maxHeight,
                }}
                className="bg-base-300 rounded-xl border border-base-200 shadow-xl py-1 z-50 overflow-hidden"
              >
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  style={{ maxHeight }}
                >
                  {formattedOptions.map((option) => {
                    const isSelected = isOptionSelected(option.value);

                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => handleSelect(option.value)}
                        accessibilityRole="button"
                        accessibilityLabel={option.label}
                        accessibilityState={{ selected: isSelected }}
                        className={`flex-row items-center justify-between px-3.5 py-2.5 ${
                          isSelected ? "bg-primary/10" : "bg-transparent"
                        }`}
                      >
                        <Text
                          style={{ fontSize }}
                          className={`font-semibold capitalize mr-3 ${
                            isSelected
                              ? "text-primary font-bold"
                              : "text-neutral"
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
                </ScrollView>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// ==================== HELPER PRESENTATIONAL / RHF VIEWS ====================

interface IRhfDropdownFieldProps {
  name: string;
  label?: string;
  formattedOptions: IDropdownOption[];
  isMultiSelect?: boolean;
  placeholder: string;
  triggerClassName: string;
  triggerTextClassName: string;
  className: string;
  maxHeight?: number;
  onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

function RhfDropdownField({
  name,
  label,
  formattedOptions,
  isMultiSelect,
  placeholder,
  triggerClassName,
  triggerTextClassName,
  className,
  maxHeight,
  onFieldChange,
}: Readonly<IRhfDropdownFieldProps>) {
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleSelectOption = (optVal: string) => {
          let nextVal: unknown;
          if (!isMultiSelect) {
            nextVal = optVal;
          } else {
            let currentArr: string[] = [];
            if (Array.isArray(value)) {
              currentArr = value as string[];
            } else if (typeof value === "string" && value) {
              currentArr = [value];
            }
            nextVal = toggleMultiSelectValue(currentArr, optVal);
          }

          onChange(nextVal);
          handleFieldSideEffects(
            name,
            nextVal,
            getValues,
            setValue,
            onFieldChange,
          );
        };

        return (
          <DropdownView
            label={label}
            formattedOptions={formattedOptions}
            selectedValue={value as string | string[]}
            isMultiSelect={isMultiSelect}
            placeholder={placeholder}
            triggerClassName={triggerClassName}
            triggerTextClassName={triggerTextClassName}
            className={className}
            maxHeight={maxHeight}
            errorMessage={error?.message}
            onSelectOption={handleSelectOption}
          />
        );
      }}
    />
  );
}

// ==================== MAIN COMPONENT ====================

export default function DropdownField({
  name,
  label,
  options,
  dropdownOptions,
  selectedValue,
  onSelect,
  isMultiSelect = false,
  placeholder = "Select",
  triggerClassName = "justify-between bg-base-100 border border-base-200 rounded-xl px-[3%] py-[3%]",
  triggerTextClassName = "",
  className = "",
  maxHeight,
  onFieldChange,
}: Readonly<IDropdownFieldProps>) {
  const formattedOptions: IDropdownOption[] =
    dropdownOptions ||
    options?.map((opt) => ({
      label: opt.label,
      value: opt.id,
    })) ||
    [];

  if (name) {
    return (
      <RhfDropdownField
        name={name}
        label={label}
        formattedOptions={formattedOptions}
        isMultiSelect={isMultiSelect}
        placeholder={placeholder}
        triggerClassName={triggerClassName}
        triggerTextClassName={triggerTextClassName}
        className={className}
        maxHeight={maxHeight}
        onFieldChange={onFieldChange}
      />
    );
  }

  const handleSelectOption = (optVal: string) => {
    if (!isMultiSelect) {
      onSelect?.(optVal);
    } else {
      let currentArr: string[] = [];
      if (Array.isArray(selectedValue)) {
        currentArr = selectedValue;
      } else if (typeof selectedValue === "string" && selectedValue) {
        currentArr = [selectedValue];
      }
      const next = toggleMultiSelectValue(currentArr, optVal);
      onSelect?.(next);
    }
  };

  return (
    <DropdownView
      label={label}
      formattedOptions={formattedOptions}
      selectedValue={selectedValue}
      isMultiSelect={isMultiSelect}
      placeholder={placeholder}
      triggerClassName={triggerClassName}
      triggerTextClassName={triggerTextClassName}
      className={className}
      maxHeight={maxHeight}
      onSelectOption={handleSelectOption}
    />
  );
}
