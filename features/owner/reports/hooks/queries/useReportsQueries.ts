import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  CustomerParams,
  getCustomers,
  getSalesByItem,
  getSalesByOrderType,
  getSalesDailySummary,
  getSalesHourly,
  getSalesSummary,
  getSalesTrend,
  SalesParams,
} from "../../apis/reports";

export const useSalesSummaryQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_SUMMARY, params, token],
    queryFn: () => getSalesSummary(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesTrendQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_TREND, params, token],
    queryFn: () => getSalesTrend(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesByOrderTypeQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [
      QUERY_KEYS.REPORTS,
      QUERY_KEYS.SALES_BY_ORDER_TYPE,
      params,
      token,
    ],
    queryFn: () => getSalesByOrderType(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useCustomersQuery = (params: CustomerParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.CUSTOMERS, params, token],
    queryFn: () => getCustomers(token!, params),
    enabled: !!token,
  });
};

export const useSalesByItemQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_BY_ITEM, params, token],
    queryFn: () => getSalesByItem(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesHourlyQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, QUERY_KEYS.SALES_HOURLY, params, token],
    queryFn: () => getSalesHourly(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesDailySummaryQuery = (params: SalesParams) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [
      QUERY_KEYS.REPORTS,
      QUERY_KEYS.SALES_DAILY_SUMMARY,
      params,
      token,
    ],
    queryFn: () => getSalesDailySummary(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};
