import { ROLE } from "@/constants";

export interface IRolePivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface IUserRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  business_id: number | null;
  is_default: number;
  is_system_default: number;
  is_default_for_business: number;
  description: string | null;
  pivot?: IRolePivot;
}

export interface IUser {
  id: number;
  first_Name: string | null;
  last_Name: string | null;
  phone: string | null;
  image: string | null;
  type: ROLE;
  driver_status: string;
  waiter_status: string;
  post_code: string | null;
  Address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  email: string;
  stripe_id: string | null;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  door_no: string | null;
  business_id: number | null;
  role?: IUserRole;
  roles?: IUserRole[];
  is_active?: boolean | number;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IUsersPaginationMeta {
  total: number;
  per_page: number | null;
  current_page: number;
  skip: number;
  total_pages: number;
}

export interface IGetUsersQueryParams {
  search_key?: string;
  role?: string;
  page?: number;
  per_page?: number;
  [key: string]: unknown;
}

export interface IGetUsersResponse {
  success: boolean;
  message: string;
  meta: IUsersPaginationMeta;
  data: IUser[];
}

export interface IOwnerProfileResponse {
  user: IUser;
  ok: boolean;
}
