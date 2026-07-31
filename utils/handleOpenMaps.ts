import { Linking, Platform } from "react-native";

export const handleOpenMaps = (address: string) => {
  const encoded = encodeURIComponent(address);
  const url =
    Platform.select({
      ios: `maps:0,0?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
    }) || `https://maps.google.com/?q=${encoded}`;
  Linking.openURL(url).catch(() => {});
};
