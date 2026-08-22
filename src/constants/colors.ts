export const COLORS = {
  primary: "#DC2D2A",
  secondary: "#61C2E2",
  accent: "#6E6E6E",
  neutral: "#000000",
  base100: "#F2F2F2",
  base200: "#FAFAFB",
  base300: "#FFFFFF",
  info: "#5881ff",
  success: "#36d399",
  warning: "#FFDB67",
  error: "#ff8369",
} as const;

export type ColorKey = keyof typeof COLORS;

export default COLORS;
