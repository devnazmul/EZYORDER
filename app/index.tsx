import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { token, user } = useAuth();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = (user?.type || "").toLowerCase().trim();
  if (role === "driver") {
    return <Redirect href="/(driver)" />;
  }

  return <Redirect href="/(owner)/home" />;
}
