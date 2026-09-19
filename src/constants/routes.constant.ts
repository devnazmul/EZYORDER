/**
 * ============================================================================
 * ROUTE CONSTANTS PATTERN & GUIDELINES FOR DEVELOPERS:
 * ============================================================================
 * Centralized, strongly-typed route definitions for Expo Router navigation.
 *
 * Usage:
 * Prefer importing route constants over hardcoded route paths to ensure type safety:
 * ```ts
 * import { AUTH_ROUTES, OWNER_ROUTES, DRIVER_ROUTES } from "@/constants";
 *
 * router.push(OWNER_ROUTES.HOME);
 * <Redirect href={AUTH_ROUTES.LOGIN} />
 * ```
 *
 * Each route map uses `as const satisfies Record<string, Href>` to guarantee compatibility
 * with Expo Router's `Href` type while preserving literal type autocompletion.
 * ============================================================================
 */

import type { Href } from "expo-router";

// ==================== AUTH ROUTES ====================
export const AUTH_ROUTES = {
  LOGIN: "/(auth)/login",
  FORGOT_PASSWORD: "/(auth)/forgot-password",
  UNAUTHORIZED: "/(auth)/unauthorized",
} as const satisfies Record<string, Href>;

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

// ==================== OWNER ROUTES ====================
export const OWNER_ROUTES = {
  // Main Tabs
  HOME: "/(owner)/(tabs)/home",
  ORDERS: "/(owner)/(tabs)/orders",
  REPORTS: "/(owner)/(tabs)/reports",
  NOTIFICATIONS: "/(owner)/(tabs)/notifications",
  MORE: "/(owner)/(tabs)/more",

  // Orders Detail Routes
  TODAYS_ORDERS: "/(owner)/orders/todays-orders",
  ALL_ORDERS: "/(owner)/orders/all-orders",
  KITCHEN_SCREEN: "/(owner)/orders/kitchen-screen",

  // Reports Detail Routes
  SALES_REPORT: "/(owner)/reports/sales",
  CUSTOMERS_REPORT: "/(owner)/reports/customers",
  ORDERS_REPORT: "/(owner)/reports/orders",

  // More Detail Routes
  BUSINESS_SETTINGS: "/(owner)/more/business-settings",
  DISCOUNTS_AND_CAMPAIGNS: "/(owner)/more/discounts-and-campaigns",
  DISHES: "/(owner)/more/dishes",
  EXPENSE_TYPES: "/(owner)/more/expense-types",
  EXPENSES: "/(owner)/more/expenses",
  MENU: "/(owner)/more/menu",
  PARTNERS: "/(owner)/more/partners",
  PROFILE: "/(owner)/more/profile",
  TABLES_AND_RESERVATIONS: "/(owner)/more/tables-and-reservations",
  USER_MANAGEMENT: "/(owner)/more/user-management",
} as const satisfies Record<string, Href>;

export type OwnerRoute = (typeof OWNER_ROUTES)[keyof typeof OWNER_ROUTES];

// ==================== DRIVER ROUTES ====================
export const DRIVER_ROUTES = {
  DASHBOARD: "/(driver)",
  MY_ORDERS: "/(driver)/my-orders",
} as const satisfies Record<string, Href>;

export type DriverRoute = (typeof DRIVER_ROUTES)[keyof typeof DRIVER_ROUTES];

// ==================== ALL APP ROUTES ====================
export const APP_ROUTES = {
  AUTH: AUTH_ROUTES,
  OWNER: OWNER_ROUTES,
  DRIVER: DRIVER_ROUTES,
} as const;

export type AppRoute = AuthRoute | OwnerRoute | DriverRoute;
