export const COLORS = {
  primary: "#DC2D2A",
  secondary: "#61C2E2",
  accent: "#6E6E6E",
  neutral: "#000000",
  base100: "#F2F2F2",
  base200: "#FAFAFB",
  base300: "#FFFFFF",
  info: "#5881ff",
  success: "#10B981",
  warning: "#FFDB67",
  error: "#DC2D2A",
  amount: {
    total: "#059669",
    gross: "#6366F1",
    net: "#3B82F6",
    discount: "#F97316",
    average: "#8B5CF6",
    paid: "#10B981",
    unpaid: "#DC2D2A",
  },
  payment: {
    cash: "#6366F1",
    card: "#3B82F6",
    online: "#10B981",
  },
  orderType: {
    delivery: "#DC2D2A",
    eat_in: "#10B981",
    take_away: "#F59E0B",
    walk_in: "#8B5CF6",
  },
  orderStatus: {
    pending: "#F59E0B",
    accepted: "#6366F1",
    kitchen: "#61C2E2",
    ready: "#22C55E",
    picked_up: "#3B82F6",
    en_route: "#0284C7",
    arrived: "#8B5CF6",
    delivered: "#0D9488",
    completed: "#10B981",
    cancelled: "#DC2D2A",
  },
} as const;

export type IColorKey = keyof typeof COLORS;

export default COLORS;
