// 3. External libraries / config
import axiosClient from "@/config/axiosClient";
import { ROLE } from "@/constants";

// 6. Types
import type {
  IGetUsersQueryParams,
  IGetUsersResponse,
  IOwnerProfileResponse,
} from "../types";

const ALLOWED_STAFF_ROLES = new Set<string>([
  ROLE.ADMIN,
  ROLE.WAITER,
  ROLE.DRIVER,
]);

/**
 * Fetch all users with optional query parameters/filters and filter response for staff members.
 */
export const getUsers = async (
  params: IGetUsersQueryParams = {},
): Promise<IGetUsersResponse> => {
  const response = await axiosClient.get<IGetUsersResponse>("/v1.0/users", {
    params,
    validateStatus: (status) => status < 400,
  });

  if (response.data && Array.isArray(response.data.data)) {
    const filteredData = response.data.data.filter((user) => {
      const roleName = (user.role?.name || user.type)?.toLowerCase();
      return roleName ? ALLOWED_STAFF_ROLES.has(roleName) : false;
    });

    return {
      ...response.data,
      data: filteredData,
    };
  }

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
