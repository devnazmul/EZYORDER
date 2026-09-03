import { IOrderFilterValues } from "@/features/order";
import { IOrder } from "../types";

export type IOrderReportFilterValues = IOrderFilterValues;

export const INITIAL_FILTER_VALUES: IOrderReportFilterValues = {
  period: "All Time",
  status: ["all"],
  payment_status: "all",
  order_type: ["all"],
  customer_name: "",
  customer_phone: "",
  table_number: "",
  date_range: { start: "", end: "" },
  time_range: { start: "", end: "" },
  amount_range: { min: "", max: "" },
};

export interface IOrdersReportState {
  searchQuery: string;
  filterValues: IOrderReportFilterValues;
  page: number;
  selectedOrder: IOrder | null;
}

export type IOrdersReportAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTER_VALUES"; payload: IOrderReportFilterValues }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SELECTED_ORDER"; payload: IOrder | null };

export const initialOrdersReportState: IOrdersReportState = {
  searchQuery: "",
  filterValues: INITIAL_FILTER_VALUES,
  page: 1,
  selectedOrder: null,
};

export function ordersReportReducer(
  state: IOrdersReportState,
  action: IOrdersReportAction,
): IOrdersReportState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, page: 1 };
    case "SET_FILTER_VALUES":
      return { ...state, filterValues: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SELECTED_ORDER":
      return { ...state, selectedOrder: action.payload };
    default:
      return state;
  }
}
