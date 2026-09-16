// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  GetTableMatrixResponse,
  GetTablesResponse,
  IGetTablesQueryParams,
} from "../types/tableApi.types";

/**
 * Fetch all tables with optional query parameters.
 */
export const getAllTables = async (
  params: IGetTablesQueryParams = {},
): Promise<GetTablesResponse> => {
  const response = await axiosClient.get<GetTablesResponse>(
    "/v1.0/restaurant-tables",
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};

/**
 * Fetch table matrix summary.
 */
export const getTableMatrix = async (): Promise<GetTableMatrixResponse> => {
  const response = await axiosClient.get<GetTableMatrixResponse>(
    "/v1.0/restaurant-tables/matrix",
    {
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};
