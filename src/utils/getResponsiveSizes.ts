import { useWindowDimensions } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export type ResponsiveSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

/**
 * Custom hook to dynamically re-render components on device rotation
 */
export const useResponsiveScreen = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return {
    screenWidth: width,
    screenHeight: height,
    isLandscape,
    isPortrait: !isLandscape,
    wp,
    hp,
    getResponsiveFontSize,
  };
};

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
 * Returns responsive font size using width percentage with readable minimum baseline floors
 */
export const getResponsiveFontSize = (size: ResponsiveSize | string = "md"): number => {
  switch (size) {
    case "xs":
      return Math.max(11, wp("2%"));
    case "sm":
      return Math.max(13, wp("2.6%"));
    case "md":
      return Math.max(15, wp("3.2%"));
    case "lg":
      return Math.max(17, wp("3.7%"));
    case "xl":
      return Math.max(19, wp("4.2%"));
    case "2xl":
      return Math.max(22, wp("4.8%"));
    case "3xl":
      return Math.max(26, wp("5.8%"));
    case "4xl":
      return Math.max(32, wp("7.0%"));
    default:
      return Math.max(15, wp("3.2%"));
  }
};

export const WP = wp;
export const HP = hp;
