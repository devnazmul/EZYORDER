import Button from "@/components/reuseable/Button";
import React from "react";
import { View } from "react-native";

export interface IFormActionButtonProps {
  readonly isLoading: boolean;
  readonly onPress: () => void;
  readonly cancelHandler?: () => void;
  readonly className?: string;
  readonly label?: string;
}

export default function FormActionButton({
  isLoading,
  onPress,
  cancelHandler,
  className,
  label,
}: Readonly<IFormActionButtonProps>) {
  return (
    <View className={`mt-6 ${className || ""}`}>
      <Button
        label={label || "Submit"}
        onPress={onPress}
        isLoading={isLoading}
        disabled={isLoading}
        variant="primary"
      />

      {cancelHandler && (
        <Button
          label="Cancel"
          onPress={cancelHandler}
          disabled={isLoading}
          variant="secondary"
          containerClassName="mt-3"
        />
      )}
    </View>
  );
}
