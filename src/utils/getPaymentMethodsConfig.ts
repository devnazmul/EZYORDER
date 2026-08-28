import { COLORS } from "@/constants/colors";

export type IPaymentMethodKey = "cash" | "card" | "online";

export interface IPaymentMethodConfig {
  key: IPaymentMethodKey;
  label: string;
  color: string;
}

export const PAYMENT_METHODS_CONFIG: IPaymentMethodConfig[] = [
  {
    key: "cash",
    label: "Cash",
    color: COLORS.payment.cash,
  },
  {
    key: "card",
    label: "Card Payment",
    color: COLORS.payment.card,
  },
  {
    key: "online",
    label: "Online",
    color: COLORS.payment.online,
  },
];

export function getPaymentMethodsConfig(): IPaymentMethodConfig[] {
  return PAYMENT_METHODS_CONFIG;
}

export default getPaymentMethodsConfig;
