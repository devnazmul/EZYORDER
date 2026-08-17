import { QUERY_KEYS } from "@/constants/queryKeys";
import { getOwnerProfile, getUsers } from "@/features/owner/more/apis/users";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useUsersQuery = (params: Record<string, any> = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => getUsers(token!, params),
    enabled: !!token,
  });
};

export const useOwnerProfileQuery = (id: string | number | null) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_OWNER, id],
    queryFn: () => getOwnerProfile(token!, id!),
    enabled: !!token && !!id,
  });
};
