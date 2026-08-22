import { Linking } from "react-native";

export const handleCallPhone = (phone: string) => {
  Linking.openURL(`tel:${phone}`).catch(() => {});
};
