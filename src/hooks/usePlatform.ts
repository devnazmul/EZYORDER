import { Platform } from "react-native";

export function usePlatform() {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  return {
    isIOS,
    isAndroid,
    OS: Platform.OS,
    bottomSheetKeyboardBehavior: isIOS
      ? ("extend" as const)
      : ("interactive" as const),
  };
}
