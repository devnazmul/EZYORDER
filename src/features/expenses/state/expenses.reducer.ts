// 6. Types
import type { IExpenseFilterValues } from "../schema";
import type { IExpense } from "../types";

export const DEFAULT_EXPENSE_FILTERS: IExpenseFilterValues = {
  date_range: { start: "", end: "" },
  amount_range: { min: "", max: "" },
  payment_method: "all",
  order_by: "",
};

export interface IExpensesState {
  searchQuery: string;
  filterValues: IExpenseFilterValues;
  selectedExpense: IExpense | null;
  isRefreshing: boolean;
}

export type IExpensesAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTER_VALUES"; payload: IExpenseFilterValues }
  | { type: "RESET_FILTERS" }
  | { type: "SET_SELECTED_EXPENSE"; payload: IExpense | null }
  | { type: "SET_IS_REFRESHING"; payload: boolean };

export function expensesReducer(
  state: IExpensesState,
  action: IExpensesAction,
): IExpensesState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_VALUES":
      return { ...state, filterValues: action.payload };
    case "RESET_FILTERS":
      return { ...state, filterValues: DEFAULT_EXPENSE_FILTERS };
    case "SET_SELECTED_EXPENSE":
      return { ...state, selectedExpense: action.payload };
    case "SET_IS_REFRESHING":
      return { ...state, isRefreshing: action.payload };
    default:
      return state;
  }
}
