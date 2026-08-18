import { Linking } from "react-native";

export const handleSendEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`).catch(() => {});
};
