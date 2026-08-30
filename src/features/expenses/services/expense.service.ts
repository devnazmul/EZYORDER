// 4. Shared utils & components
import { getPaymentMethodsConfig } from "@/utils";
import type { IDoughnutChartItem } from "@/components/reuseable";

// 6. Types
import type { IExpenseFilterValues } from "../schema";
import type {
  IExpenseListParams,
  IExpenseMatrixData,
  IExpenseReceipt,
  IExpenseType,
  IPaymentMethodBreakdownItem,
} from "../types";

export class ExpenseService {
  /**
   * Processes raw expense matrix data into numeric & text metrics.
   */
  static processMatrixData(matrixData?: IExpenseMatrixData | null) {
    const totalExpenses = Number(matrixData?.total_expenses) || 0;

    const rawTopType = matrixData?.top_expense_type?.name;
    let topExpenseTypeName = "N/A";
    if (typeof rawTopType === "string") {
      topExpenseTypeName = rawTopType;
    } else if (typeof rawTopType === "object" && rawTopType !== null) {
      topExpenseTypeName = rawTopType.name || "N/A";
    }

    const topExpenseSpent =
      Number(matrixData?.top_expense_type?.total_spent) || 0;
    const averageAmount = Number(matrixData?.average_expense_amount) || 0;

    return {
      totalExpenses,
      topExpenseTypeName,
      topExpenseSpent,
      averageAmount,
    };
  }

  /**
   * Resolves the category name for an expense from the expenseTypes array or raw value.
   */
  static getExpenseCategoryName(
    expenseType?: IExpenseType | string | number,
    expenseTypes?: IExpenseType[],
  ): string {
    if (typeof expenseType === "object" && expenseType !== null) {
      return expenseType.name || "Other";
    }

    const typeId = String(expenseType ?? "");
    const matchedType = expenseTypes?.find((opt) => String(opt?.id) === typeId);

    if (matchedType?.name) {
      return matchedType.name;
    }

    return typeof expenseType === "string" && expenseType.trim() !== ""
      ? expenseType
      : "Other";
  }

  /**
   * Formats payment method keys into human-readable labels.
   */
  static formatPaymentMethod(paymentMethod?: string | null): string {
    if (!paymentMethod) return "N/A";
    const config = getPaymentMethodsConfig(paymentMethod);
    return config.label || paymentMethod;
  }

  /**
   * Builds a complete image URI for an expense receipt.
   */
  static getReceiptImageUri(
    receipt?: IExpenseReceipt,
    apiBaseUrl?: string,
  ): string {
    if (!receipt) return "";
    const path = receipt.url || receipt.path || receipt.file || "";
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (!apiBaseUrl) return path;
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  }

  /**
   * Formats the sub-details display text combining vendor (paid_by) and formatted date.
   */
  static formatExpenseDetailsDisplay(
    paidBy?: string | null,
    formattedDate?: string,
  ): string {
    const parts: string[] = [];
    if (paidBy && paidBy.trim() !== "") {
      parts.push(paidBy.trim());
    }
    if (formattedDate) {
      parts.push(formattedDate);
    }
    return parts.join(" • ");
  }

  /**
   * Builds API query parameters from search key and filter values.
   */
  static buildApiParams(
    searchKey?: string,
    filterValues?: IExpenseFilterValues,
  ): Partial<IExpenseListParams> {
    const params: Partial<IExpenseListParams> = {};

    if (searchKey?.trim()) {
      params.search_key = searchKey.trim();
    }

    if (filterValues?.date_range?.start) {
      params.start_date = filterValues.date_range.start;
    }

    if (filterValues?.date_range?.end) {
      params.end_date = filterValues.date_range.end;
    }

    if (filterValues?.amount_range?.min) {
      params.min_amount = filterValues.amount_range.min;
    }

    if (filterValues?.amount_range?.max) {
      params.max_amount = filterValues.amount_range.max;
    }

    if (filterValues?.payment_method && filterValues.payment_method !== "all") {
      params.payment_method = filterValues.payment_method;
    }

    if (filterValues?.order_by) {
      const upper = filterValues.order_by.toUpperCase();
      if (upper === "ASC" || upper === "DESC") {
        params.order_by = upper;
      }
    }

    return params;
  }

  /**
   * Processes payment method breakdown data into doughnut chart items and total value.
   */
  static getPaymentMethodBreakdownChartData(
    data?: IPaymentMethodBreakdownItem[] | null,
  ): {
    total: number;
    chartItems: IDoughnutChartItem[];
  } {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { total: 0, chartItems: [] };
    }

    const total = data.reduce(
      (acc, item) => acc + (Number(item.total) || 0),
      0,
    );

    const chartItems: IDoughnutChartItem[] = data.map((item) => {
      const config = getPaymentMethodsConfig(item.payment_method);
      const val = Number(item.total) || 0;

      return {
        label: config.label,
        value: val,
        color: config.color,
        legendValue: `${Number(item.percentage || 0).toFixed(1)}%`,
      };
    });

    return { total, chartItems };
  }
}
