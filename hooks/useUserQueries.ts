import { useQuery } from "@tanstack/react-query";
import { getOwnerProfile, getUsers } from "@/apis/users";
import { QUERY_KEYS } from "@/config/queryKeys";

export const useUsersQuery = (token: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => getUsers(token, params),
    enabled: !!token,
  });
};

export const useOwnerProfileQuery = (token: string, id: string | number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_OWNER, id],
    queryFn: () => getOwnerProfile(token, id!),
    enabled: !!token && !!id,
  });
};
