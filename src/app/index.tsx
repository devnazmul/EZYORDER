import { Redirect } from "expo-router";

import { AUTH_ROUTES } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";
import { getRoleRedirectRoute } from "@/utils";

export default function Index() {
  const { token, user } = useAuth();

  if (!token) {
    return <Redirect href={AUTH_ROUTES.LOGIN} />;
  }

  return <Redirect href={getRoleRedirectRoute(user?.role?.name || "")} />;
}
