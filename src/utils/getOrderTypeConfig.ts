import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

export type OrderTypeKey = "delivery" | "eat_in" | "take_away" | "walk_in";

export interface IOrderTypeConfig {
  key: OrderTypeKey;
  label: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const ORDER_TYPES_CONFIG: Record<OrderTypeKey, IOrderTypeConfig> = {
  delivery: {
    key: "delivery",
    label: "Delivery",
    color: COLORS.orderType.delivery,
    icon: "delivery-dining",
  },
  eat_in: {
    key: "eat_in",
    label: "Eat In",
    color: COLORS.orderType.eat_in,
    icon: "store",
  },
  take_away: {
    key: "take_away",
    label: "Take Away",
    color: COLORS.orderType.take_away,
    icon: "shopping-bag",
  },
  walk_in: {
    key: "walk_in",
    label: "Walk In",
    color: COLORS.orderType.walk_in,
    icon: "directions-walk",
  },
};

export const DEFAULT_ORDER_TYPE_CONFIG: IOrderTypeConfig = {
  key: "unknown" as OrderTypeKey,
  label: "Unknown",
  color: COLORS.accent,
  icon: "help-outline",
};

export function getOrderTypeConfig(key: string): IOrderTypeConfig {
  const normalizedKey = (key || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as OrderTypeKey;

  return ORDER_TYPES_CONFIG[normalizedKey] || DEFAULT_ORDER_TYPE_CONFIG;
}

export default getOrderTypeConfig;
