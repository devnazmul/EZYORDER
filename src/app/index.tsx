import { ALLOWED_ROLES, ROLE } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { token, user } = useAuth();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = (user?.role?.name || "").toLowerCase().trim() as ROLE;
  const isAllowed = ALLOWED_ROLES.includes(role);

  if (!isAllowed) {
    return <Redirect href="/(auth)/unauthorized" />;
  }

  if (role === ROLE.DRIVER) {
    return <Redirect href="/(driver)" />;
  }

  if (role === ROLE.OWNER) {
    return <Redirect href="/(owner)/home" />;
  }

  return <Redirect href="/(auth)/unauthorized" />;
}
