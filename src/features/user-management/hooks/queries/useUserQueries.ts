// 3. External libraries
import { useQuery } from "@tanstack/react-query";

// 4. Shared context & constants
import { USER_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";

// 5. Feature API & types
import {
  getOwnerProfile,
  getUsers,
} from "@/features/user-management/apis/users";
import type {
  IGetUsersQueryParams,
  IGetUsersResponse,
  IOwnerProfileResponse,
} from "../../types";

export const useUsersQuery = (params: IGetUsersQueryParams = {}) => {
  const { token } = useAuth();
  return useQuery<IGetUsersResponse>({
    queryKey: USER_KEYS.list(params),
    queryFn: () => getUsers(params),
    enabled: !!token,
  });
};

export const useOwnerProfileQuery = (id: string | number | null) => {
  const { token } = useAuth();
  return useQuery<IOwnerProfileResponse>({
    queryKey: USER_KEYS.owner(id),
    queryFn: () => getOwnerProfile(id!),
    enabled: !!token && !!id,
  });
};
