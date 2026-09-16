// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  GetReservationsResponse,
  IGetReservationsQueryParams,
} from "../types/reservationApi.types";

export const getReservations = async (
  params: IGetReservationsQueryParams = {},
): Promise<GetReservationsResponse> => {
  const response = await axiosClient.get<GetReservationsResponse>(
    "/v1.0/reservations",
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};
