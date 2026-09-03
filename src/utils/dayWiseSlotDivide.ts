export interface TimeSlot {
  id: number | string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // e.g. "12:00:00"
  end_time: string; // e.g. "23:00:00"
  is_active: number | boolean;
}

export interface DaySlots {
  day: number;
  slots: TimeSlot[];
}

/**
 * Divides a list of time slots day by day, filtering out days that don't have slots.
 */
export const dayWiseSlotDivide = (time_slots?: TimeSlot[]): DaySlots[] => {
  if (!Array.isArray(time_slots)) return [];
  return [0, 1, 2, 3, 4, 5, 6]
    .map((day) => {
      const slotsByDay = time_slots.filter((slot) => Number(slot?.day_of_week) === day);
      return { day, slots: slotsByDay };
    })
    .filter((daySlot) => daySlot.slots.length > 0);
};

export default dayWiseSlotDivide;
