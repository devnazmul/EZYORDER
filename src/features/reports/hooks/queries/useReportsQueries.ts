import { REPORT_KEYS } from "@/constants";
import { useAuth } from "@/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllOrdersForReports,
  getCustomers,
  getOrderSummary,
  getOrderTypeReport,
  getSalesByItem,
  getSalesByOrderType,
  getSalesPaymentSummary,
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

export const usePaymentSummaryQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: REPORT_KEYS.paymentSummary({ token, ...params }),
    queryFn: () => getSalesPaymentSummary(params),
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

export const useOrdersReportListInfiniteQuery = (
  params: IOrdersReportParams,
  options?: { enabled?: boolean },
) => {
  const { token } = useAuth();
  // Omit page parameter from query key so all pages share the same query cache
  const { page, ...paramsWithoutPage } = params;

  return useInfiniteQuery({
    queryKey: REPORT_KEYS.ordersReportList({ token, ...paramsWithoutPage }),
    queryFn: ({ pageParam = 1 }) =>
      getAllOrdersForReports({
        ...paramsWithoutPage,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      const { current_page, total_pages } = lastPage.meta;
      const currentPageNum = Number(current_page);
      const totalPagesNum = Number(total_pages);
      return currentPageNum < totalPagesNum ? currentPageNum + 1 : undefined;
    },
    enabled: !!token && (options?.enabled ?? true),
  });
};
