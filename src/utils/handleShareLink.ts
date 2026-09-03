import { Alert, Share } from "react-native";

import { ENV } from "@/config/env";

export interface IShareLinkOptions {
  link: string;
  message?: string;
  title?: string;
}

/**
 * Utility to build full URL and share a link via React Native Share API.
 */
export const handleShareLink = async ({
  link,
  message,
  title,
}: IShareLinkOptions): Promise<void> => {
  if (!link) return;
  try {
    let fullUrl = link;
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      const baseUrl = ENV.API_BASE_URL.replace(/\/api\/?$/, "");
      const normalizedPath = link.startsWith("/") ? link : `/${link}`;
      fullUrl = `${baseUrl}${normalizedPath}`;
    }

    const shareMessage = message ? `${message}: ${fullUrl}` : fullUrl;

    await Share.share({
      title,
      message: shareMessage,
      url: fullUrl,
    });
  } catch (error: unknown) {
    const errMessage =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Failed to share link";
    Alert.alert("Error", errMessage);
  }
};
