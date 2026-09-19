import type { IReservation, ReservationStatus } from "./reservation.types";

export interface IGetReservationsQueryParams {
  per_page?: number;
  page?: number;
  status?: ReservationStatus;
  date?: string;
  order_by?: string;
  sort_order?: "ASC" | "DESC";
}

export type GetReservationsResponse = {
  success: boolean;
  message?: string;
  data: IReservation[];
};
