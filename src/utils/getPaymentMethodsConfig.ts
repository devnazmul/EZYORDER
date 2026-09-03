import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

export type IPaymentMethodKey =
  "cash" | "card" | "online" | "bank" | "bank_transfer" | "cheque";

export interface IPaymentMethodConfig {
  key: IPaymentMethodKey;
  label: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const PAYMENT_METHODS_CONFIG: Record<IPaymentMethodKey, IPaymentMethodConfig> =
  {
    cash: {
      key: "cash",
      label: "Cash",
      color: COLORS.payment.cash,
      icon: "currency-pound",
    },
    card: {
      key: "card",
      label: "Card Payment",
      color: COLORS.payment.card,
      icon: "credit-card",
    },
    online: {
      key: "online",
      label: "Online",
      color: COLORS.payment.online,
      icon: "language",
    },
    bank: {
      key: "bank",
      label: "Bank Transfer",
      color: COLORS.payment.online,
      icon: "account-balance",
    },
    bank_transfer: {
      key: "bank_transfer",
      label: "Bank Transfer",
      color: COLORS.payment.online,
      icon: "account-balance",
    },
    cheque: {
      key: "cheque",
      label: "Cheque",
      color: COLORS.payment.cheque,
      icon: "payments",
    },
  };

//keep this loosely typed
export const DEFAULT_PAYMENT_METHOD_CONFIG: IPaymentMethodConfig = {
  key: "unknown" as unknown as IPaymentMethodKey,
  label: "Unknown",
  color: COLORS.accent,
  icon: "help-outline",
};

export function getPaymentMethodsConfig(key: string): IPaymentMethodConfig {
  const normalizedKey = (key || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as IPaymentMethodKey;

  return PAYMENT_METHODS_CONFIG[normalizedKey] || DEFAULT_PAYMENT_METHOD_CONFIG;
}

export default getPaymentMethodsConfig;
