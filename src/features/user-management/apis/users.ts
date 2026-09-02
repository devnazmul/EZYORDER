// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  IGetUsersQueryParams,
  IGetUsersResponse,
  IOwnerProfileResponse,
} from "../types";

/**
 * Fetch all users with optional query parameters/filters
 */
export const getUsers = async (
  params: IGetUsersQueryParams = {},
): Promise<IGetUsersResponse> => {
  const response = await axiosClient.get<IGetUsersResponse>("/v1.0/users", {
    params,
    validateStatus: (status) => status < 400,
  });

  return response.data;
};

/**
 * Fetch single owner profile by ID
 */
export const getOwnerProfile = async (
  id: string | number,
): Promise<IOwnerProfileResponse> => {
  const response = await axiosClient.get<IOwnerProfileResponse>(
    `/owner/${id}`,
    {
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};
