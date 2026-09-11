import type { ICoupon } from "./coupon.types";

export interface IGetCouponsQueryParams {
  businessId?: number | string;
  perPage?: number;
  start_date?: string;
  end_date?: string;
  search_key?: string;
  page?: number;
}

export interface IPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface IGetCouponsPaginatedResponse {
  current_page: number;
  data: ICoupon[];
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

export type GetCouponsResponse = IGetCouponsPaginatedResponse;
