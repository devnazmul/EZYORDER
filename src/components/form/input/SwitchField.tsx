// 1. React / React Native
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import BrandAlertModal from "@/components/reuseable/BrandAlertModal";
import CustomText, {
  type ICustomTextProps,
} from "@/components/reuseable/CustomText";
import InputError from "./InputError";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";

export interface ISwitchFieldProps {
  readonly name: string;
  readonly label?: string | ((isActive: boolean) => string);
  readonly labelProps?:
    ICustomTextProps | ((isActive: boolean) => ICustomTextProps);
  readonly confirmPrompt?: boolean;
  readonly confirmTitle?: string | ((nextState: boolean) => string);
  readonly confirmDescription?: string | ((nextState: boolean) => string);
  readonly disabled?: boolean;
  readonly className?: string;
}

export default function SwitchField({
  name,
  label,
  labelProps,
  confirmPrompt = true,
  confirmTitle,
  confirmDescription,
  disabled = false,
  className = "",
}: Readonly<ISwitchFieldProps>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [alertVisible, setAlertVisible] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const isCurrentActive =
          value === true || value === 1 || value === "1" || value === "active";

        const resolvedLabel =
          typeof label === "function" ? label(isCurrentActive) : label;

        const resolvedLabelProps: ICustomTextProps =
          typeof labelProps === "function"
            ? labelProps(isCurrentActive)
            : labelProps || {};

        const handleToggleRequest = () => {
          if (disabled) return;
          const nextState = !isCurrentActive;

          if (confirmPrompt) {
            setPendingValue(nextState);
            setAlertVisible(true);
          } else {
            onChange(nextState);
          }
        };

        const handleConfirm = () => {
          if (pendingValue !== null) {
            onChange(pendingValue);
          }
          setAlertVisible(false);
          setPendingValue(null);
        };

        const handleCancel = () => {
          setAlertVisible(false);
          setPendingValue(null);
        };

        const nextTargetState = pendingValue ?? !isCurrentActive;
        const targetStatusLabel = nextTargetState ? "Active" : "Inactive";

        const resolvedTitle =
          typeof confirmTitle === "function"
            ? confirmTitle(nextTargetState)
            : confirmTitle || "Confirm Status Change";

        const resolvedDescription =
          typeof confirmDescription === "function"
            ? confirmDescription(nextTargetState)
            : confirmDescription ||
              `Are you sure you want to set this to ${targetStatusLabel}?`;

        return (
          <View className={`flex-col ${className}`}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleRequest}
              disabled={disabled}
              className="flex-row items-center gap-2"
            >
              {Boolean(resolvedLabel) && (
                <CustomText size="xs" weight="semibold" {...resolvedLabelProps}>
                  {resolvedLabel}
                </CustomText>
              )}

              {/* Custom styled switch track and thumb with full width/height control */}
              <View
                className="justify-center rounded-full"
                style={{
                  width: 45,
                  height: 18,

                  backgroundColor: isCurrentActive
                    ? COLORS.primary
                    : COLORS.base200,
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 11,
                    backgroundColor: COLORS.base300,
                    alignSelf: isCurrentActive ? "flex-end" : "flex-start",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.5,
                    elevation: 2,
                  }}
                />
              </View>
            </TouchableOpacity>

            <InputError errorMessage={errorMessage} />

            {confirmPrompt && (
              <BrandAlertModal
                visible={alertVisible}
                type="confirm"
                title={resolvedTitle}
                description={resolvedDescription}
                confirmText="Confirm"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </View>
        );
      }}
    />
  );
}
