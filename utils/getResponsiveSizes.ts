import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export type ResponsiveSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

/**
 * Returns height percentage based on standard size tokens
 */
export const getResponsiveHeight = (size: ResponsiveSize | string = "md"): number => {
  switch (size) {
    case "xs":
      return hp("3%");
    case "sm":
      return hp("4%");
    case "md":
      return hp("5%");
    case "lg":
      return hp("6%");
    case "xl":
      return hp("6%");
    case "2xl":
      return hp("7%");
    case "3xl":
      return hp("8%");
    default:
      return hp("5%");
  }
};

/**
 * Returns width percentage based on standard size tokens
 */
export const getResponsiveWidth = (size: ResponsiveSize | string = "md"): number => {
  switch (size) {
    case "xs":
      return wp("3%");
    case "sm":
      return wp("4%");
    case "md":
      return wp("5%");
    case "lg":
      return wp("6%");
    case "xl":
      return wp("6%");
    case "2xl":
      return wp("7%");
    case "3xl":
      return wp("8%");
    default:
      return wp("5%");
  }
};

/**
 * Returns responsive font size based on height percentage
 */
export const getResponsiveFontSize = (size: ResponsiveSize | string = "md"): number => {
  switch (size) {
    case "xs":
      return hp("1%");
    case "sm":
      return hp("1.2%");
    case "md":
      return hp("1.5%");
    case "lg":
      return hp("1.7%");
    case "xl":
      return hp("1.9%");
    case "2xl":
      return hp("2%");
    case "3xl":
      return hp("3%");
    case "4xl":
      return hp("4%");
    default:
      return hp("1.5%");
  }
};

export const WP = wp;
export const HP = hp;
