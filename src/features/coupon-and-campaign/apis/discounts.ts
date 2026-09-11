// 1. External libraries / config
import axiosClient from "@/config/axiosClient";

// 2. Types
import type {
  GetCampaignsResponse,
  IGetCampaignsQueryParams,
} from "../types/campaignApi.types";
import type {
  GetCouponsResponse,
  IGetCouponsQueryParams,
} from "../types/couponApi.types";

export const getCoupons = async (
  businessId: number | string,
  perPage: number = 50,
  params: IGetCouponsQueryParams = {},
): Promise<GetCouponsResponse> => {
  const response = await axiosClient.get<GetCouponsResponse>(
    `/v1.0/coupons/${businessId}/${perPage}`,
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};

export const getCampaigns = async (
  businessId: number | string,
  perPage: number = 50,
  params: IGetCampaignsQueryParams = {},
): Promise<GetCampaignsResponse> => {
  const response = await axiosClient.get<GetCampaignsResponse>(
    `/v1.0/campaigns/${businessId}/${perPage}`,
    {
      params,
      validateStatus: (status) => status < 400,
    },
  );

  return response.data;
};
