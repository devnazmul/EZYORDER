// 1. External libraries / icons
import { MaterialIcons } from "@expo/vector-icons";

// 2. Types
import type { CampaignCategoryType } from "../types/campaign.types";

// 3. Constants
import { COLORS } from "@/constants";

export interface ICampaignCategory {
  id: string;
  name: string;
  value: CampaignCategoryType;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
  color: string;
}

export const CAMPAIGN_CATEGORIES_CONFIG: Record<
  CampaignCategoryType,
  ICampaignCategory
> = {
  buy_one_get_one_same: {
    id: "1",
    name: "Buy One Get One Free (BOGOF)",
    value: "buy_one_get_one_same",
    icon: "card-giftcard",
    description:
      "Buy one get one free deals. Boost your sales volume with high-value item pairings.",
    color: COLORS.primary,
  },
  buy_one_get_one_other: {
    id: "2",
    name: "Buy One Item and Get Another Item Free",
    value: "buy_one_get_one_other",
    icon: "view-carousel",
    description:
      "Special bundle offers. Mix and match related products to increase basket size.",
    color: COLORS.secondary,
  },
  spend_certain_amount: {
    id: "3",
    name: "Spend Certain Amount And Get Discount",
    value: "spend_certain_amount",
    icon: "shopping-bag",
    description:
      "Tiered spending rewards. Incentivize higher spending with progressive discounts.",
    color: COLORS.orderType.take_away,
  },
  menu_discount: {
    id: "4",
    name: "Overall Store Discount (Percentage-Based)",
    value: "menu_discount",
    icon: "percent",
    description:
      "Store-wide savings. Run holiday sales or seasonal clearance across all categories.",
    color: COLORS.orderType.walk_in,
  },
  time_based_discount: {
    id: "5",
    name: "Time-Based Discount (Happy Hour Discount)",
    value: "time_based_discount",
    icon: "schedule",
    description:
      "Limited time flash sales. Create urgency with time-sensitive promotional windows.",
    color: COLORS.orderStatus.pending,
  },
};

export const DEFAULT_CAMPAIGN_CATEGORY_CONFIG: ICampaignCategory = {
  id: "0",
  name: "Campaign Category",
  value: "menu_discount",
  icon: "sell",
  description: "Special promotional offer",
  color: COLORS.accent,
};

export const CAMPAIGN_CATEGORY_LIST: ICampaignCategory[] = Object.values(
  CAMPAIGN_CATEGORIES_CONFIG,
);

export function getCampaignCategoryConfig(
  key?: string | null,
): ICampaignCategory {
  if (!key) return DEFAULT_CAMPAIGN_CATEGORY_CONFIG;
  const normalizedKey = key
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as CampaignCategoryType;
  return (
    CAMPAIGN_CATEGORIES_CONFIG[normalizedKey] ||
    DEFAULT_CAMPAIGN_CATEGORY_CONFIG
  );
}

export default getCampaignCategoryConfig;
