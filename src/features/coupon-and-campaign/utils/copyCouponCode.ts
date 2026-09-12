// 1. Expo / Navigation
import * as Clipboard from "expo-clipboard";

export const copyCouponCode = async (code: string): Promise<void> => {
  if (!code) return;
  await Clipboard.setStringAsync(code);
};
