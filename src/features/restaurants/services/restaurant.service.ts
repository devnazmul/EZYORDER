import type { IBusinessDay, IBusinessTimingResponse } from "@/types";

export class RestaurantService {
  /**
   * Processes and sorts business timing data from Monday (1) to Sunday (0).
   */
  static sortBusinessTimings(
    timingData?: IBusinessTimingResponse | { data?: IBusinessDay[] } | null,
  ): IBusinessDay[] {
    if (!timingData) return [];

    let list: IBusinessDay[] = [];
    if (Array.isArray(timingData)) {
      list = [...timingData];
    } else if (Array.isArray(timingData.data)) {
      list = [...timingData.data];
    }

    return list.sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB;
    });
  }
}
