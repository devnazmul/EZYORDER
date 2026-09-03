// 4. Shared utils & components
import type { IDoughnutChartItem } from "@/components/reuseable";
import type { IBarChartDataItem } from "@/components/reuseable/BarChart";
import { COLORS } from "@/constants/colors";
import { formatAmount, getPaymentMethodsConfig } from "@/utils";

// 6. Types
import type {
  IExpenseFilterValues,
  IExpenseFormData,
  ICreateExpenseTypeFormData,
  IUpdateExpenseTypeFormData,
  IExpenseTypeFormData,
} from "../schema";
import type {
  ICreateExpensePayload,
  ICreateExpenseTypePayload,
  IExpenseListParams,
  IExpenseMatrixData,
  IExpenseReceipt,
  IExpenseTrendItem,
  IExpenseType,
  IPaymentMethodBreakdownItem,
  IUpdateExpensePayload,
  IUpdateExpenseTypePayload,
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
   * Helper to resolve expense_type query parameter.
   */
  private static resolveExpenseTypeParam(
    expenseType?: IExpenseFilterValues["expense_type"],
  ): IExpenseListParams["expense_type"] | undefined {
    if (!expenseType) return undefined;
    if (Array.isArray(expenseType)) {
      const filtered = expenseType.filter((t) => String(t) !== "all");
      if (filtered.length > 0) {
        return filtered.length === 1 ? filtered[0] : filtered;
      }
      return undefined;
    }
    return expenseType !== "all" ? expenseType : undefined;
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

    const {
      date_range,
      amount_range,
      expense_type,
      payment_method,
      status,
      paid_by,
      order_by,
    } = filterValues || {};

    if (date_range?.start) params.start_date = date_range.start;
    if (date_range?.end) params.end_date = date_range.end;
    if (amount_range?.min) params.min_amount = amount_range.min;
    if (amount_range?.max) params.max_amount = amount_range.max;

    const resolvedType = ExpenseService.resolveExpenseTypeParam(expense_type);
    if (resolvedType) params.expense_type = resolvedType;

    if (payment_method && payment_method !== "all") {
      params.payment_method = payment_method;
    }

    if (status && status !== "all") {
      if (status === "active") {
        params.is_active = 1;
      } else if (status === "inactive") {
        params.is_active = 0;
      }
    }

    if (paid_by && paid_by.trim() !== "") {
      params.paid_by = paid_by.trim();
    }

    if (order_by) {
      const upper = order_by.toUpperCase();
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
    currencySymbol = "£",
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
        formattedValue: formatAmount(val, currencySymbol),
        color: config.color,
        legendValue: `${Number(item.percentage || 0).toFixed(1)}%`,
      };
    });

    return { total, chartItems };
  }

  /**
   * Processes expense trend data into primary gradient bar chart items.
   * Aggregates into weekly buckets (starting Monday) when trend data has > 14 items.
   */
  static getExpenseTrendChartData(trendData?: IExpenseTrendItem[] | null): {
    chartData: IBarChartDataItem[];
    totalSpent: number;
    isEmpty: boolean;
  } {
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0) {
      return { chartData: [], totalSpent: 0, isEmpty: true };
    }

    let totalSpent = 0;
    trendData.forEach((item) => {
      totalSpent += Number(item.total_spent) || 0;
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (trendData.length <= 14) {
      const chartData: IBarChartDataItem[] = trendData.map((item) => {
        const val = Number(item.total_spent) || 0;

        let name = item.date;
        if (item.date) {
          const parts = item.date.split("-");
          if (parts.length === 3) {
            const day = parts[0];
            const monthNum = Number.parseInt(parts[1], 10);
            const month = monthNames[monthNum - 1] || parts[1];
            name = `${day} ${month}`;
          }
        }

        return {
          name,
          value: val,
          frontColor: COLORS.primary,
          gradientColor: "#FF9E93",
        };
      });

      return {
        chartData,
        totalSpent,
        isEmpty: chartData.length === 0 || totalSpent === 0,
      };
    }

    // Aggregate into weekly buckets (starting Monday) when > 14 items
    const weeklyBuckets = new Map<
      string,
      { total: number; mondayDate: Date | null }
    >();

    trendData.forEach((item) => {
      const val = Number(item.total_spent) || 0;
      let key = item.date;
      let mondayDate: Date | null = null;

      if (item.date) {
        const parts = item.date.split("-");
        if (parts.length === 3) {
          const dd = Number.parseInt(parts[0], 10);
          const mm = Number.parseInt(parts[1], 10);
          const yyyy = Number.parseInt(parts[2], 10);

          if (!Number.isNaN(dd) && !Number.isNaN(mm) && !Number.isNaN(yyyy)) {
            const dateObj = new Date(yyyy, mm - 1, dd);
            const day = dateObj.getDay();
            const offset = day === 0 ? -6 : 1 - day;
            mondayDate = new Date(yyyy, mm - 1, dd + offset);

            const mYear = mondayDate.getFullYear();
            const mMonth = String(mondayDate.getMonth() + 1).padStart(2, "0");
            const mDay = String(mondayDate.getDate()).padStart(2, "0");
            key = `${mYear}-${mMonth}-${mDay}`;
          }
        }
      }

      if (!weeklyBuckets.has(key)) {
        weeklyBuckets.set(key, { total: 0, mondayDate });
      }
      const bucket = weeklyBuckets.get(key)!;
      bucket.total += val;
    });

    const sortedKeys = Array.from(weeklyBuckets.keys()).sort((a, b) =>
      a.localeCompare(b),
    );
    const chartData: IBarChartDataItem[] = sortedKeys.map((key) => {
      const bucket = weeklyBuckets.get(key)!;
      let name = key;

      if (bucket.mondayDate) {
        const dayNum = bucket.mondayDate.getDate();
        const monthStr = monthNames[bucket.mondayDate.getMonth()];
        name = `${dayNum} ${monthStr}`;
      }

      return {
        name,
        value: Number(bucket.total.toFixed(2)),
        frontColor: COLORS.primary,
        gradientColor: "#FF9E93",
      };
    });

    return {
      chartData,
      totalSpent,
      isEmpty: chartData.length === 0 || totalSpent === 0,
    };
  }

  /**
   * Transforms validated form data and receipt image URLs into a Create Expense payload.
   */
  static toCreatePayload(
    formData: IExpenseFormData,
    uploadedReceiptUrls: string[],
  ): ICreateExpensePayload {
    return {
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      payment_date: formData.payment_date,
      expense_type: String(formData.expense_type),
      reciepts: uploadedReceiptUrls,
      restaurant_id: formData.restaurant_id,
      note: formData.note || "",
      paid_by: formData.paid_by,
      description: formData.description || "",
      is_active: formData.is_active ?? true,
    };
  }

  /**
   * Transforms validated form data and receipt image URLs into an Update Expense payload.
   */
  static toUpdatePayload(
    formData: IExpenseFormData,
    uploadedReceiptUrls: string[],
  ): IUpdateExpensePayload {
    if (!formData.id) {
      throw new Error("Expense ID is required for update operation");
    }
    return {
      ...this.toCreatePayload(formData, uploadedReceiptUrls),
      id: formData.id,
    };
  }

  /**
   * Transforms validated form data into a Create Expense Type payload.
   */
  static toCreateExpenseTypePayload(
    formData: ICreateExpenseTypeFormData | IExpenseTypeFormData,
  ): ICreateExpenseTypePayload {
    return {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      restaurant_id: formData.restaurant_id,
      is_active: formData.is_active,
    };
  }

  /**
   * Transforms validated form data into an Update Expense Type payload.
   */
  static toUpdateExpenseTypePayload(
    formData: IUpdateExpenseTypeFormData | IExpenseTypeFormData,
  ): IUpdateExpenseTypePayload {
    if (!formData.id) {
      throw new Error("Expense Type ID is required for update operation");
    }
    return {
      id: formData.id,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      restaurant_id: formData.restaurant_id,
      is_active: formData.is_active,
    };
  }
}
