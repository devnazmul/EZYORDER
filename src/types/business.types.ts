export interface IBusinessTimingQueryParams {
  restaurant_id?: number | string | null;
}

export interface IBusinessDayTimeSlot {
  id: number;
  business_day_id: number;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
}

export interface IBusinessDay {
  id: number;
  day: number;
  business_id: number;
  is_weekend: number;
  created_at: string;
  updated_at: string;
  time_slots: IBusinessDayTimeSlot[];
}

export type IBusinessTimingResponse = IBusinessDay[];
