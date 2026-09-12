// 1. External libraries
import { useInfiniteQuery } from "@tanstack/react-query";

// 2. Shared context / hooks
import { useAuth } from "@/context/AuthContext";

// 3. Feature apis
import {
  getCampaigns,
  getCoupons,
} from "@/features/coupon-and-campaign/apis/discounts";

// 4. Types
import type {
  GetCampaignsResponse,
  IGetCampaignsQueryParams,
} from "@/features/coupon-and-campaign/types/campaignApi.types";
import type {
  GetCouponsResponse,
  IGetCouponsQueryParams,
} from "@/features/coupon-and-campaign/types/couponApi.types";

// 5. Constants/utils
import { CAMPAIGN_KEYS, COUPON_KEYS } from "@/constants/queryKeys";

export const useCouponsQuery = (
  businessId: number | string,
  perPage: number = 20,
  params: IGetCouponsQueryParams = {},
) => {
  const { token } = useAuth();
  const { page, ...paramsWithoutPage } = params;

  return useInfiniteQuery({
    queryKey: COUPON_KEYS.list({ businessId, perPage, ...paramsWithoutPage }),
    queryFn: ({ pageParam = 1 }) =>
      getCoupons(businessId, perPage, {
        ...paramsWithoutPage,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetCouponsResponse) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.current_page ?? 1);
      const lastPageNum = Number(lastPage.last_page ?? 1);
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    enabled: !!token && !!businessId,
  });
};

export const useCampaignsQuery = (
  businessId: number | string,
  perPage: number = 20,
  params: IGetCampaignsQueryParams = {},
) => {
  const { token } = useAuth();
  const { page, ...paramsWithoutPage } = params;

  return useInfiniteQuery({
    queryKey: CAMPAIGN_KEYS.list({
      businessId,
      perPage,
      ...paramsWithoutPage,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getCampaigns(businessId, perPage, {
        ...paramsWithoutPage,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetCampaignsResponse) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.current_page ?? 1);
      const lastPageNum = Number(lastPage.last_page ?? 1);
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    enabled: !!token && !!businessId,
  });
};
