// 1. React / React Native
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. Shared components
import { CustomText } from "@/components/reuseable";

// 4. Constants/utils
import { COLORS } from "@/constants";
import { copyCouponCode } from "../utils/copyCouponCode";

interface ICouponCopyButtonProps {
  code: string;
}

export default function CouponCopyButton({
  code,
}: Readonly<ICouponCopyButtonProps>) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopyCode = async () => {
    await copyCouponCode(code);
    setIsCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 1800);
  };

  return (
    <View
      style={{
        overflow: "visible",
        position: "relative",
        alignItems: "center",
      }}
    >
      {isCopied && (
        <View
          className="bg-neutral rounded-md px-2.5 py-1 flex-row items-center gap-1 shadow-lg"
          style={{
            position: "absolute",
            bottom: "100%",
            marginBottom: 8,
            marginLeft: -12,
            zIndex: 9999,
            alignSelf: "center",
          }}
        >
          <MaterialIcons name="check-circle" size={10} color={COLORS.success} />
          <CustomText style={{ color: COLORS.success }} size="xs" weight="bold">
            Copied!
          </CustomText>
        </View>
      )}
      <TouchableOpacity
        onPress={handleCopyCode}
        className="bg-base-200 border border-dashed border-accent/40 rounded-lg px-2.5 py-1.5 flex-row items-center gap-1 active:bg-base-100 max-w-[160px] sm:max-w-[220px]"
      >
        <CustomText
          variant="primary"
          size="xs"
          weight="bold"
          numberOfLines={1}
          className="shrink"
        >
          {code}
        </CustomText>
        <MaterialIcons name="content-copy" size={10} color={COLORS.neutral} />
      </TouchableOpacity>
    </View>
  );
}
