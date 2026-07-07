import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/apis/users";
import { QUERY_KEYS } from "@/config/queryKeys";

export const useUsersQuery = (token: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => getUsers(token, params),
    enabled: !!token,
  });
};
