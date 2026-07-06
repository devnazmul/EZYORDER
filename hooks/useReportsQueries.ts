import { useQuery } from "@tanstack/react-query";
import { getSalesSummary, getSalesTrend, getSalesByOrderType, SalesParams } from "@/apis/reports";

export const useSalesSummaryQuery = (token: string | null, params: SalesParams) => {
  return useQuery({
    queryKey: ["reports", "salesSummary", params, token],
    queryFn: () => getSalesSummary(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesTrendQuery = (token: string | null, params: SalesParams) => {
  return useQuery({
    queryKey: ["reports", "salesTrend", params, token],
    queryFn: () => getSalesTrend(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useSalesByOrderTypeQuery = (token: string | null, params: SalesParams) => {
  return useQuery({
    queryKey: ["reports", "salesByOrderType", params, token],
    queryFn: () => getSalesByOrderType(token!, params),
    enabled: !!token && !!params.restaurant_id,
  });
};
