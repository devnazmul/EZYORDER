import type { MaterialIcons } from "@expo/vector-icons";

/**
 * Shared configuration interface for Expo Router bottom tab items.
 */
export interface ITabItemConfig {
  /** Route screen name inside the (tabs) layout group */
  name: string;
  /** Display title for tab label and header */
  title: string;
  /** MaterialIcons name for tab icon */
  icon: keyof typeof MaterialIcons.glyphMap;
  /** Optional flag indicating whether a notification badge is rendered */
  hasBadge?: boolean;
}
