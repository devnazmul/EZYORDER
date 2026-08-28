import type {
  IExpenseListParams,
  IExpenseMatrixParams,
  IExpenseTypesParams,
} from "@/features/expenses/types";
import type {
  ICustomerParams,
  IOrderTypeReportParams,
  IOrdersReportParams,
  ISalesParams,
} from "@/features/reports/types";
import type {
  IBusinessTimingQueryParams,
  IMenuQueryParams,
  IRestaurantQueryParams,
} from "@/types";

/**
 * ============================================================================
 * ARCHITECTURAL GUIDELINE & MIGRATION NOTE FOR AGENTS & PR REVIEWERS:
 * ============================================================================
 * This file is undergoing phased refactoring to strictly adhere to the guidelines
 * defined in `.agents/rules/gemini.md` (Rule #1: Domain-Shaped Query Key Factories).
 *
 * Current State:
 * - Domain factories (e.g. `REPORT_KEYS`, `RESTAURANT_KEYS`, `BUSINESS_TIMING_KEYS`,
 *   `MENU_KEYS` below) follow the strict rule pattern: returning typed `as const` key
 *   tuples with query parameter scopes to enable targeted cache invalidation and type safety.
 * - Legacy keys in `QUERY_KEYS` are intentionally retained in their current shape
 *   to avoid breaking legacy screens during ongoing development. They will be
 *   gradually migrated to domain-shaped query key factories feature-by-feature.
 * ============================================================================
 */

export const QUERY_KEYS = {
  // Table keys
  TABLES: "tables",
  TABLE_MATRIX: "table_matrix",
  SINGLE_TABLE: "single_table",

  // Reservation keys
  RESERVATIONS: "reservations",
  SINGLE_RESERVATION: "single_reservation",

  // User keys
  USERS: "users",
  SINGLE_USER: "single_user",
  SINGLE_OWNER: "single_owner",

  // Discount keys
  COUPONS: "coupons",
  CAMPAIGNS: "campaigns",

  // Expense keys
  EXPENSES: "expenses",
  EXPENSE_TYPES: "expense_types",
  EXPENSE_MATRIX: "expense_matrix",

  // Partner keys
  PARTNERS: "partners",
  DAILY_ORDER_PARTNER_SALES: "daily_order_partner_sales",

  // Order keys
  ORDERS: "orders",

  // Restaurant/DataProvider keys
  COMBINE_DATA: "combineData",
  RESTAURANT: "restaurant",
  BUSINESS_TIMING: "businessTiming",
  DISHES: "dishes",
  SINGLE_MENU: "single_menu",
  MENU_ALL: "menuAll",
  MENU_MATRIX: "menuMatrix",

  // Driver keys
  DRIVER_DASHBOARD_STATS: "driverDashboardStats",
  DRIVER_ACTIVE_ASSIGNED_ORDERS: "driverActiveAssignedOrders",
  DRIVER_ORDERS_LIST: "driverOrdersList",
  ORDER_DETAIL: "orderDetail",
} as const;

type IReportQueryParams<T> = { token?: string | null } & Partial<T>;

/**
 * Domain-Shaped Query Key Factory for Reports.
 */
export const REPORT_KEYS = {
  all: ["reports"] as const,

  // Sales Summary
  salesSummaries: () => [...REPORT_KEYS.all, "salesSummary"] as const,
  salesSummary: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.salesSummaries(), params] as const,

  // Payment Summary
  paymentSummaries: () => [...REPORT_KEYS.all, "paymentSummary"] as const,
  paymentSummary: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.paymentSummaries(), params] as const,

  // Order Summary
  orderSummaries: () => [...REPORT_KEYS.all, "orderSummary"] as const,
  orderSummary: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.orderSummaries(), params] as const,

  // Sales Trend
  salesTrends: () => [...REPORT_KEYS.all, "salesTrend"] as const,
  salesTrend: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.salesTrends(), params] as const,

  // Sales by Order Type
  salesByOrderTypes: () => [...REPORT_KEYS.all, "salesByOrderType"] as const,
  salesByOrderType: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.salesByOrderTypes(), params] as const,

  // Customers
  customers: () => [...REPORT_KEYS.all, "customers"] as const,
  customerList: (params: IReportQueryParams<ICustomerParams>) =>
    [...REPORT_KEYS.customers(), params] as const,

  // Sales by Item
  salesByItems: () => [...REPORT_KEYS.all, "salesByItem"] as const,
  salesByItem: (params: IReportQueryParams<ISalesParams>) =>
    [...REPORT_KEYS.salesByItems(), params] as const,

  // Order Type Report
  orderTypeReports: () => [...REPORT_KEYS.all, "orderTypeReport"] as const,
  orderTypeReport: (params: IReportQueryParams<IOrderTypeReportParams>) =>
    [...REPORT_KEYS.orderTypeReports(), params] as const,

  // Orders Report List (Paginated & Filtered)
  ordersReports: () => [...REPORT_KEYS.all, "ordersReportList"] as const,
  ordersReportList: (params: IReportQueryParams<IOrdersReportParams>) =>
    [...REPORT_KEYS.ordersReports(), params] as const,
} as const;

/**
 * Domain-Shaped Query Key Factory for Restaurant.
 */
export const RESTAURANT_KEYS = {
  all: ["restaurant"] as const,
  details: () => [...RESTAURANT_KEYS.all, "detail"] as const,
  detail: (params?: IRestaurantQueryParams) =>
    [...RESTAURANT_KEYS.details(), params] as const,
} as const;

/**
 * Domain-Shaped Query Key Factory for Business Operating Timing.
 */
export const BUSINESS_TIMING_KEYS = {
  all: ["businessTiming"] as const,
  details: () => [...BUSINESS_TIMING_KEYS.all, "detail"] as const,
  detail: (params?: IBusinessTimingQueryParams) =>
    [...BUSINESS_TIMING_KEYS.details(), params] as const,
} as const;

/**
 * Domain-Shaped Query Key Factory for Menu & Catalog.
 */
export const MENU_KEYS = {
  all: ["menu"] as const,
  catalogs: () => [...MENU_KEYS.all, "catalog"] as const,
  catalog: (params?: IMenuQueryParams) =>
    [...MENU_KEYS.catalogs(), params] as const,
} as const;

/**
 * Domain-Shaped Query Key Factory for Expenses.
 */
export const EXPENSE_KEYS = {
  all: ["expenses"] as const,

  // Expenses List
  lists: () => [...EXPENSE_KEYS.all, "list"] as const,
  list: (params?: IExpenseListParams) =>
    [...EXPENSE_KEYS.lists(), params] as const,

  // Expense Types List
  types: () => [...EXPENSE_KEYS.all, "types"] as const,
  typeList: (params?: IExpenseTypesParams) =>
    [...EXPENSE_KEYS.types(), params] as const,

  // Expense Matrix (KPI Summary)
  matrices: () => [...EXPENSE_KEYS.all, "matrix"] as const,
  matrix: (params?: IExpenseMatrixParams) =>
    [...EXPENSE_KEYS.matrices(), params] as const,
} as const;
