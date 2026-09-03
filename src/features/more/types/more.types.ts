import type { MaterialIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export interface ISettingItem {
  id: string;
  title: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  bgClassName: string;
}

export interface ISettingSection {
  title: string;
  items: ISettingItem[];
}
