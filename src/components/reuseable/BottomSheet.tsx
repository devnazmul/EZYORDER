import React, { useCallback, useEffect, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";

interface BottomSheetProps extends Omit<BottomSheetModalProps, "children"> {
  visible: boolean;
  onClose: () => void;
  snapPoints?: string[];
  children: React.ReactNode;
}

const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...backdropProps}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.6}
  />
);

export default function BottomSheet({
  visible,
  onClose,
  snapPoints = ["50%"],
  children,
  ...props
}: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (visible && !isOpenRef.current) {
      isOpenRef.current = true;
      const timer = setTimeout(() => bottomSheetRef.current?.present(), 50);
      return () => clearTimeout(timer);
    } else if (!visible && isOpenRef.current) {
      isOpenRef.current = false;
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    isOpenRef.current = false;
    onClose();
  }, [onClose]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: "#E2E8F0", width: 48 }}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
}

