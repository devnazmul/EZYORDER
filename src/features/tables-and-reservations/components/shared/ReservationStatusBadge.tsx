// 4. Shared components
import { Badge } from "@/components/reuseable";

// 5. Feature types & utils
import type { ReservationStatus } from "../../types/reservation.types";
import { getReservationStatusConfig } from "../../utils/getReservationStatusConfig";

// 7. Constants/utils
import { getResponsiveFontSize } from "@/utils";

interface IReservationStatusBadgeProps {
  status?: ReservationStatus;
}

export default function ReservationStatusBadge({
  status,
}: Readonly<IReservationStatusBadgeProps>) {
  const cfg = getReservationStatusConfig(status);

  return (
    <Badge
      text={cfg.label}
      containerClassName={`border ${cfg.bgClass}`}
      textClassName={`font-bold capitalize ${cfg.textClass}`}
      textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
      iconName={cfg.iconName}
      iconColor={cfg.iconColor}
      iconSize={10}
    />
  );
}
