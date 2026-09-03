/**
 * @deprecated Deprecated in favor of `getOrderTypeConfig.ts`.
 * Use `getOrderTypeConfig()` from `@/utils/getOrderTypeConfig` instead.
 */
import { COLORS } from "@/constants/colors";

/**
 * @deprecated Deprecated in favor of `ORDER_TYPES_CONFIG` from `@/utils/getOrderTypeConfig`.
 */
export const ORDER_TYPE_COLORS: Record<string, string> = {
  delivery: COLORS.orderType.delivery,
  eat_in: COLORS.orderType.eat_in,
  take_away: COLORS.orderType.take_away,
  walk_in: COLORS.orderType.walk_in,
};

/**
 * @deprecated Deprecated in favor of `getOrderTypeConfig()` from `@/utils/getOrderTypeConfig`.
 */
export const getOrderTypeColor = (name: string): string => {
  const key = String(name || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_");
  return ORDER_TYPE_COLORS[key] || COLORS.orderType.delivery;
};
