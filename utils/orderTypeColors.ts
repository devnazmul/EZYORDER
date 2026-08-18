export const ORDER_TYPE_COLORS: Record<string, string> = {
  delivery: "#DC2D2A", // Brand Primary
  eat_in: "#10B981", // Emerald Green
  take_away: "#F59E0B", // Amber Orange
  walk_in: "#8B5CF6", // Violet Purple
};

export const getOrderTypeColor = (name: string): string => {
  const key = String(name || "")
    .toLowerCase()
    .trim()
    .split(" ")
    .join("_");
  return ORDER_TYPE_COLORS[key] || "#DC2D2A";
};
