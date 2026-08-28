import { type IDoughnutChartItem } from "@/components/reuseable";
import {
  getOrderTypeConfig,
  getPaymentMethodsConfig,
  IPaymentMethodKey,
} from "@/utils";
import { IOrderReportFilterValues } from "../state/ordersReport.reducer";
import {
  IOrdersReportParams,
  IPaymentSummaryData,
  ISalesByOrderTypeItem,
} from "../types";

export class ReportsService {
  /**
   * Processes payment summary data into formatted doughnut chart items & total
   */
  static getPaymentChartData(paymentSummary?: IPaymentSummaryData | null): {
    total: number;
    chartItems: IDoughnutChartItem[];
  } {
    const cash = Number(paymentSummary?.cash ?? 0);
    const card = Number(paymentSummary?.card ?? 0);
    const online = Number(paymentSummary?.online ?? 0);

    const total = Number(paymentSummary?.total ?? cash + card + online);

    const paymentKeys: IPaymentMethodKey[] = ["cash", "card", "online"];

    const chartItems: IDoughnutChartItem[] = paymentKeys.map((key) => {
      const config = getPaymentMethodsConfig(key);
      const rawValue = paymentSummary?.[key as keyof IPaymentSummaryData];
      const value = Number(rawValue ?? 0);
      const percent =
        total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;

      return {
        label: config.label,
        value,
        color: config.color,
        legendValue: `${percent}%`,
      };
    });

    return { total, chartItems };
  }

  /**
   * Processes sales by order type data into formatted doughnut chart items & total amount
   */
  static getRevenueByOrderTypeChartData(
    orderTypeData?: ISalesByOrderTypeItem[] | Record<string, unknown> | null,
    netSales = 0,
  ): {
    totalAmount: number;
    chartItems: IDoughnutChartItem[];
    isEmpty: boolean;
  } {
    const list: ISalesByOrderTypeItem[] = Array.isArray(orderTypeData)
      ? orderTypeData
      : [];

    const totalAmount = list.reduce(
      (acc: number, item: ISalesByOrderTypeItem) =>
        acc + Number(item.total_sales || item.amount || item.value || 0),
      0,
    );

    const chartItems: IDoughnutChartItem[] = list.map(
      (item: ISalesByOrderTypeItem) => {
        const val = Number(item.total_sales || item.amount || item.value || 0);
        const config = getOrderTypeConfig(item.order_type || "");
        const percent =
          netSales > 0 ? Math.min(Math.round((val / netSales) * 100), 100) : 0;

        return {
          label: config.label,
          value: val,
          color: config.color,
          legendValue: `${percent}%`,
        };
      },
    );

    return {
      totalAmount,
      chartItems,
      isEmpty: list.length === 0,
    };
  }

  /**
   * Build query parameters for orders report list API
   */
  static buildOrdersListParams(
    restaurantId: string,
    page: number,
    resolvedDateRange: { start_date: string; end_date: string },
    searchQuery: string,
    filterValues: IOrderReportFilterValues,
  ): IOrdersReportParams {
    const p: IOrdersReportParams = {
      restaurant_id: restaurantId,
      per_page: 15,
      page,
      from_date: resolvedDateRange.start_date,
      to_date: resolvedDateRange.end_date,
      search_key: searchQuery.trim(),
    };

    if (
      filterValues.status &&
      !filterValues.status.includes("all") &&
      filterValues.status.length > 0
    ) {
      p.status = filterValues.status.join(",");
    }

    if (
      filterValues.order_type &&
      !filterValues.order_type.includes("all") &&
      filterValues.order_type.length > 0
    ) {
      p.type = filterValues.order_type.join(",");
    }

    if (filterValues.amount_range?.min) {
      p.min_amount = filterValues.amount_range.min;
    }
    if (filterValues.amount_range?.max) {
      p.max_amount = filterValues.amount_range.max;
    }
    if (filterValues.customer_name) {
      p.customer_name = filterValues.customer_name;
    }
    if (filterValues.customer_phone) {
      p.customer_phone = filterValues.customer_phone;
    }
    if (filterValues.table_number) {
      p.table_number = filterValues.table_number;
    }
    if (filterValues.time_range?.start) {
      p.start_time = filterValues.time_range.start;
    }
    if (filterValues.time_range?.end) {
      p.end_time = filterValues.time_range.end;
    }

    return p;
  }
}
