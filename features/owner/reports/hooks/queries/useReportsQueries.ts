import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  getCustomers,
  getOrderSummary,
  getSalesByItem,
  getSalesByOrderType,
  getSalesSummary,
  getSalesTrend,
  ICustomerParams,
  ISalesParams,
} from "../../apis/reports";

export const useSalesSummaryQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_SUMMARY, token, params],
    queryFn: () => getSalesSummary(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useOrderSummaryQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.ORDER_SUMMARY, token, params],
    queryFn: () => getOrderSummary(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesTrendQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_TREND, token, params],
    queryFn: () => getSalesTrend(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesByOrderTypeQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [
      QUERY_KEYS.REPORTS,
      QUERY_KEYS.SALES_BY_ORDER_TYPE,
      token,
      params,
    ],
    queryFn: () => getSalesByOrderType(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useCustomersQuery = (params: ICustomerParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.CUSTOMERS, token, params],
    queryFn: () => getCustomers(token!, params),
    enabled: !!token,
  });
};

export const useSalesByItemQuery = (params: ISalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_BY_ITEM, token, params],
    queryFn: () => getSalesByItem(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};
