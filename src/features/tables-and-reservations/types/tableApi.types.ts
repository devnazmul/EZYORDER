import type { ITable, ITableMatrixSummary } from "./table.types";

export interface ITableResponseMeta {
  total?: number;
  per_page?: number | null;
  current_page?: string | number;
  skip?: number;
  total_pages?: number;
}

export interface IGetTablesQueryParams {
  page?: number | string;
  status?: string;
  area?: string;
  search_key?: string;
  is_active?: boolean;
}

export type GetTablesResponse = {
  success: boolean;
  message?: string;
  meta?: ITableResponseMeta;
  data: ITable[];
};

export type GetTableMatrixResponse = {
  success: boolean;
  message?: string;
  data: ITableMatrixSummary;
};
