import type { ITable } from "./table.types";

export type ReservationStatus =
  "pending" | "accepted" | "declined" | "cancelled";

export type ReservationArea = "indoor" | "outdoor" | "rooftop";

export interface IReservation {
  id: number;
  restaurant_id?: number;
  customer_name?: string;
  phone?: string;
  email?: string;
  guests_count?: number;
  reservation_date?: string;
  reservation_time?: string;
  table_id?: number | null;
  status?: ReservationStatus;
  area?: ReservationArea;
  source?: string;
  special_request?: string | null;
  order_id?: number | null;
  handled_by?: number | null;
  handled_at?: string | null;
  created_at?: string;
  updated_at?: string;
  table?: ITable | null;
}
