import { COLORS } from "@/constants/colors";

export type IPaymentMethodKey = "cash" | "card" | "online";

export interface IPaymentMethodConfig {
  key: IPaymentMethodKey;
  label: string;
  color: string;
}

const PAYMENT_METHODS_CONFIG: Record<IPaymentMethodKey, IPaymentMethodConfig> =
  {
    cash: {
      key: "cash",
      label: "Cash",
      color: COLORS.payment.cash,
    },
    card: {
      key: "card",
      label: "Card Payment",
      color: COLORS.payment.card,
    },
    online: {
      key: "online",
      label: "Online",
      color: COLORS.payment.online,
    },
  };

export const DEFAULT_PAYMENT_METHOD_CONFIG = {
  key: "unknown",
  label: "Unknown",
  color: COLORS.accent,
};

export function getPaymentMethodsConfig(key: string): IPaymentMethodConfig {
  const normalizedKey = (key || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as IPaymentMethodKey;

  return PAYMENT_METHODS_CONFIG[normalizedKey] || DEFAULT_PAYMENT_METHOD_CONFIG;
}

export default getPaymentMethodsConfig;
