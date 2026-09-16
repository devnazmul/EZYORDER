// 2. Expo / Navigation
import type { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { Badge } from "@/components/reuseable";

// 6. Types
import { COLORS } from "@/constants";
import type { ReservationArea } from "../../types/reservation.types";

// 7. Constants/utils
import { getResponsiveFontSize } from "@/utils";

interface IAreaBadgeProps {
  area?: ReservationArea;
}

const getAreaIcon = (
  area?: ReservationArea,
): keyof typeof MaterialIcons.glyphMap => {
  const a = (area || "").toLowerCase().trim();
  if (a.includes("indoor")) return "home";
  if (a.includes("outdoor")) return "deck";
  if (a.includes("rooftop")) return "roofing";
  return "place";
};

export default function AreaBadge({ area }: Readonly<IAreaBadgeProps>) {
  const areaName = area || "General";
  const areaIcon = getAreaIcon(area);

  return (
    <Badge
      text={areaName}
      containerClassName="bg-accent/15 border border-accent/30"
      textClassName="font-bold capitalize text-accent"
      textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
      iconName={areaIcon}
      iconColor={COLORS.primary}
      iconSize={10}
    />
  );
}
