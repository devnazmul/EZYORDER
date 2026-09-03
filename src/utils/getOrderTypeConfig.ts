import { COLORS } from "@/constants/colors";

export type IOrderTypeKey = "delivery" | "eat_in" | "take_away" | "walk_in";

export interface IOrderTypeConfig {
  key: IOrderTypeKey;
  label: string;
  color: string;
}

const ORDER_TYPES_CONFIG: Record<IOrderTypeKey, IOrderTypeConfig> = {
  delivery: {
    key: "delivery",
    label: "Delivery",
    color: COLORS.orderType.delivery,
  },
  eat_in: {
    key: "eat_in",
    label: "Eat In",
    color: COLORS.orderType.eat_in,
  },
  take_away: {
    key: "take_away",
    label: "Take Away",
    color: COLORS.orderType.take_away,
  },
  walk_in: {
    key: "walk_in",
    label: "Walk In",
    color: COLORS.orderType.walk_in,
  },
};

export const DEFAULT_ORDER_TYPE_CONFIG = {
  key: "unknown",
  label: "Unknown",
  color: COLORS.accent,
};

export function getOrderTypeConfig(key: string): IOrderTypeConfig {
  const normalizedKey = (key || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as IOrderTypeKey;

  return ORDER_TYPES_CONFIG[normalizedKey] || DEFAULT_ORDER_TYPE_CONFIG;
}

export default getOrderTypeConfig;
