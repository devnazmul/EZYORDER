import COLORS from "@/constants/colors";
import type { ISettingSection } from "../types/more.types";

export const SETTING_SECTIONS: ISettingSection[] = [
  {
    title: "Restaurant",
    items: [
      {
        id: "menu",
        title: "Menu Management",
        route: "/more/menu",
        icon: "restaurant-menu",
        color: COLORS.primary,
        bgClassName: "bg-primary/10",
      },
      {
        id: "tables",
        title: "Tables & Reservations",
        route: "/more/tables-and-reservations",
        icon: "table-restaurant",
        color: COLORS.primary,
        bgClassName: "bg-primary/10",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        id: "discounts",
        title: "Discounts & Campaigns",
        route: "/more/discounts-and-campaigns",
        icon: "sell",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
      {
        id: "users",
        title: "User Management",
        route: "/more/user-management",
        icon: "people",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
      {
        id: "expenses",
        title: "Expenses",
        route: "/more/expenses",
        icon: "receipt",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
      {
        id: "expense-types",
        title: "Expense Types",
        route: "/more/expense-types",
        icon: "receipt-long",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
      {
        id: "partners",
        title: "Partners",
        route: "/more/partners",
        icon: "handshake",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
      {
        id: "business",
        title: "Business Settings",
        route: "/more/business-settings",
        icon: "settings",
        color: COLORS.secondary,
        bgClassName: "bg-secondary/10",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        id: "profile",
        title: "Profile",
        route: "/more/profile",
        icon: "person",
        color: COLORS.accent,
        bgClassName: "bg-base-200",
      },
    ],
  },
];
