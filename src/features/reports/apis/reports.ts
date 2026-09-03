import axiosClient from "@/config/axiosClient";
import { logApiResponse } from "@/utils";
import {
  ICustomerListResponse,
  ICustomerParams,
  IOrderSummaryData,
  IOrderTypeReportData,
  IOrderTypeReportParams,
  IOrdersReportListResponse,
  IOrdersReportParams,
  IPaymentSummaryData,
  ISalesByOrderTypeItem,
  ISalesParams,
  ISalesSummaryData,
  ISalesTrendItem,
  ITopProductItem,
} from "../types";

// ============================================================================
// 1. SALES REPORT APIS (SalesReportScreen)
// ============================================================================

/**
 * Fetch overall sales financial summary (gross sales, net sales, taxes, expenses, profits, discounts).
 * Endpoint: GET /reports/sales/summary
 */
export const getSalesSummary = async (
  params?: ISalesParams,
): Promise<ISalesSummaryData | null> => {
  const response = await axiosClient.get("/reports/sales/summary", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch sales trend over time for trend / area charts.
 * Endpoint: GET /reports/sales/trend
 */
export const getSalesTrend = async (
  params?: ISalesParams,
): Promise<ISalesTrendItem[] | null> => {
  const response = await axiosClient.get("/reports/sales/trend", {
    params,
    validateStatus: () => true,
  });

  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch revenue breakdown by order type.
 * Endpoint: GET /reports/sales/by-order-type
 */
export const getSalesByOrderType = async (
  params?: ISalesParams,
): Promise<ISalesByOrderTypeItem[] | Record<string, unknown> | null> => {
  const response = await axiosClient.get("/reports/sales/by-order-type", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch sales breakdown by individual menu items / top products.
 * Endpoint: GET /reports/sales/by-item
 */
export const getSalesByItem = async (
  params?: ISalesParams,
): Promise<ITopProductItem[] | null> => {
  const response = await axiosClient.get("/reports/sales/by-item", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch sales payment summary breakdown (cash, card, online, total).
 * Endpoint: GET /reports/sales/payment-summary
 */
export const getSalesPaymentSummary = async (
  params?: ISalesParams,
): Promise<IPaymentSummaryData | null> => {
  const response = await axiosClient.get("/reports/sales/payment-summary", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

// ============================================================================
// 2. CUSTOMER REPORT APIS (CustomersReportScreen)
// ============================================================================

/**
 * Fetch paginated & filtered customer list with visit metrics, revenue, and ratings.
 * Endpoint: GET /v1.0/customers
 */
export const getCustomers = async (
  params?: ICustomerParams,
): Promise<ICustomerListResponse | null> => {
  const response = await axiosClient.get("/v1.0/customers", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data
    : null;
};

// ============================================================================
// 3. ORDERS REPORT APIS (OrdersReportScreen)
// ============================================================================

/**
 * Fetch order summary counts (total, completed, pending, cancelled, average order value).
 * Used in Orders Report (and Sales Report) for order distribution & volume metrics.
 * Endpoint: GET /v1.0/orders/summary
 */
export const getOrderSummary = async (
  params?: ISalesParams,
): Promise<IOrderSummaryData | null> => {
  const response = await axiosClient.get("/v1.0/orders/summary", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch order type report breakdown (order counts & sales per channel: eat_in, delivery, take_away, walk_in).
 * Endpoint: GET /v1.0/orders/type-report
 */
export const getOrderTypeReport = async (
  params?: IOrderTypeReportParams,
): Promise<IOrderTypeReportData | null> => {
  const response = await axiosClient.get("/v1.0/orders/type-report", {
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

/**
 * Fetch all orders for reports with pagination, date filtering, and multi-criteria search.
 * Endpoint: GET /v1.0/orders
 */
export const getAllOrdersForReports = async (
  params?: IOrdersReportParams,
): Promise<IOrdersReportListResponse | null> => {
  const response = await axiosClient.get("/v1.0/orders", {
    params,
    validateStatus: () => true,
  });
  logApiResponse("orders", response.data);
  return response.status === 200 && response.data?.success
    ? response.data
    : null;
};
