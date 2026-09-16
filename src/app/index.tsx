import { Redirect } from "expo-router";

import {
  ALLOWED_ROLES,
  AUTH_ROUTES,
  DRIVER_ROUTES,
  OWNER_ROUTES,
  ROLE,
} from "@/constants";
import { useAuth } from "@/src/context/AuthContext";

export default function Index() {
  const { token, user } = useAuth();

  if (!token) {
    return <Redirect href={AUTH_ROUTES.LOGIN} />;
  }

  const role = (user?.role?.name || "").toLowerCase().trim() as ROLE;
  const isAllowed = ALLOWED_ROLES.includes(role);

  if (!isAllowed) {
    return <Redirect href={AUTH_ROUTES.UNAUTHORIZED} />;
  }

  if (role === ROLE.DRIVER) {
    return <Redirect href={DRIVER_ROUTES.DASHBOARD} />;
  }

  if (role === ROLE.OWNER) {
    return <Redirect href={OWNER_ROUTES.HOME} />;
  }

  return <Redirect href={AUTH_ROUTES.UNAUTHORIZED} />;
}
