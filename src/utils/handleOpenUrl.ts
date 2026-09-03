import { Linking } from "react-native";

/**
 * Handles opening a web URL in the device browser, automatically prepending https:// if missing protocol.
 */
export const handleOpenUrl = (url: string): void => {
  if (!url?.trim()) return;
  const cleanUrl = url.trim();
  const fullUrl =
    cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")
      ? cleanUrl
      : `https://${cleanUrl}`;

  Linking.openURL(fullUrl).catch(() => {});
};
