// 1. React / React Native
import { Share } from "react-native";

// 2. Types
import type { ICoupon } from "../types/coupon.types";

export const shareCoupon = async (
  coupon: ICoupon,
  discountDisplay: string,
): Promise<void> => {
  try {
    const endDate = coupon.coupon_end_date?.split(" ")[0] || "further notice";
    await Share.share({
      message: `Use code ${coupon.code} to get ${discountDisplay} at our restaurant! Valid until ${endDate}.`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
