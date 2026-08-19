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

  // Reports keys
  REPORTS: "reports",
  SALES_SUMMARY: "salesSummary",
  ORDER_SUMMARY: "orderSummary",
  SALES_TREND: "salesTrend",
  SALES_BY_ORDER_TYPE: "salesByOrderType",
  CUSTOMERS: "customers",
  SALES_BY_ITEM: "salesByItem",
  SALES_HOURLY: "salesHourly",
  SALES_DAILY_SUMMARY: "salesDailySummary",

  // Driver keys
  DRIVER_DASHBOARD_STATS: "driverDashboardStats",
  DRIVER_ACTIVE_ASSIGNED_ORDERS: "driverActiveAssignedOrders",
  DRIVER_ORDERS_LIST: "driverOrdersList",
  ORDER_DETAIL: "orderDetail",
} as const;
