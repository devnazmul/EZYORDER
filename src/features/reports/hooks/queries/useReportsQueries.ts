import { REPORT_KEYS } from "@/constants";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  getAllOrdersForReports,
  getCustomers,
  getOrderSummary,
  getOrderTypeReport,
  getSalesByItem,
  // NOSONAR: Temporarily retained for backward compatibility
  getSalesByOrderType,
  getSalesSummary,
  getSalesTrend,
} from "../../apis/reports";
import {
  ICustomerParams,
  IOrderTypeReportParams,
  IOrdersReportParams,
  ISalesParams,
} from "../../types";

export const useSalesSummaryQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.salesSummary({ token, ...params }),
    queryFn: () => getSalesSummary(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useOrderSummaryQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.orderSummary({ token, ...params }),
    queryFn: () => getOrderSummary(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesTrendQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.salesTrend({ token, ...params }),
    queryFn: () => getSalesTrend(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesByOrderTypeQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.salesByOrderType({ token, ...params }),
    // NOSONAR: Temporarily retained for backward compatibility
    queryFn: () => getSalesByOrderType(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useCustomersQuery = (params: ICustomerParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.customerList({ token, ...params }),
    queryFn: () => getCustomers(params),
    enabled: !!token,
  });
};

export const useSalesByItemQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.salesByItem({ token, ...params }),
    queryFn: () => getSalesByItem(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useOrderTypeReportQuery = (params: IOrderTypeReportParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.orderTypeReport({ token, ...params }),
    queryFn: () => getOrderTypeReport(params),
    enabled: !!token,
  });
};

export const useOrdersReportListQuery = (
  params: IOrdersReportParams,
  options?: { enabled?: boolean },
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.ordersReportList({ token, ...params }),
    queryFn: () => getAllOrdersForReports(params),
    enabled: !!token && (options?.enabled ?? true),
  });
};
