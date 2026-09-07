import { ROLE } from "@/constants";
import type { IUser } from "./user.types";

export interface IUsersPaginationMeta {
  total: number;
  per_page: number | null;
  current_page: number;
  skip: number;
  total_pages: number;
}

export interface IGetUsersQueryParams {
  search_key?: string;
  role?: ROLE | string;
  page?: number;
  per_page?: number;
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
