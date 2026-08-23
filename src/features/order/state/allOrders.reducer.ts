import { IOrder } from "@/src/features/reports/types/order.types";
import { IOrderFilterValues } from "../types/orderFilter.types";

export interface IAllOrdersState {
  activeTab: "live" | "historical";
  searchQuery: string;
  filterValues: IOrderFilterValues;
  selectedOrder: IOrder | null;
  showDetailsModal: boolean;
}

export type IAllOrdersAction =
  | { type: "SET_ACTIVE_TAB"; payload: "live" | "historical" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | {
      type: "SET_FILTER_VALUES";
      payload: Partial<IOrderFilterValues> | IOrderFilterValues;
    }
  | { type: "SET_SELECTED_ORDER"; payload: IOrder | null }
  | { type: "SET_SHOW_DETAILS_MODAL"; payload: boolean };

export const defaultFilterValues: IOrderFilterValues = {
  status: ["all"],
  payment_status: "all",
  order_type: ["all"],
  customer_name: "",
  customer_phone: "",
  table_number: "",
  date_range: { start: "", end: "" },
  amount_range: { min: "", max: "" },
};

export function allOrdersReducer(
  state: IAllOrdersState,
  action: IAllOrdersAction,
): IAllOrdersState {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_VALUES":
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          ...action.payload,
        } as IOrderFilterValues,
      };
    case "SET_SELECTED_ORDER":
      return { ...state, selectedOrder: action.payload };
    case "SET_SHOW_DETAILS_MODAL":
      return { ...state, showDetailsModal: action.payload };
    default:
      return state;
  }
}
