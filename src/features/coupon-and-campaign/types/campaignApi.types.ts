import type { ICampaign } from "./campaign.types";
import type { IPaginationLink } from "./couponApi.types";

export interface IGetCampaignsQueryParams {
  businessId?: number | string;
  perPage?: number;
  type?: string;
  search_key?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}

export interface IGetCampaignsPaginatedResponse {
  current_page: number;
  data: ICampaign[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: IPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type GetCampaignsResponse = IGetCampaignsPaginatedResponse;
