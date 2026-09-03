import {
  type IBarChartDataItem,
  type IDoughnutChartItem,
} from "@/components/reuseable";
import COLORS from "@/constants/colors";
import { formatDoughnutChartItems, getOrderStatusConfig } from "@/utils";
import { IOrderReportFilterValues } from "../state/ordersReport.reducer";
import { IOrdersReportParams, IOrderSummaryData } from "../types";

export class OrderReportsService {
  /**
   * Processes order summary data into formatted doughnut chart items & total count for status distribution
   */
  static getOrderStatusDistributionChartData(
    summaryData?: IOrderSummaryData | null,
  ): {
    totalOrders: number;
    chartItems: IDoughnutChartItem[];
    isEmpty: boolean;
  } {
    const totalOrders = summaryData?.total_orders ?? 0;

    const statusCounts = [
      {
        key: "completed",
        value: summaryData?.completed_orders ?? 0,
      },
      {
        key: "pending",
        value:
          summaryData?.pending?.total ?? summaryData?.pending?.pending ?? 0,
      },
      {
        key: "cancelled",
        value: summaryData?.cancelled?.total ?? 0,
      },
    ];

    const chartItems = formatDoughnutChartItems(
      statusCounts,
      ({ key, value }) => {
        const config = getOrderStatusConfig(key);
        return { label: config.label, color: config.color, value };
      },
      totalOrders,
    );

    return {
      totalOrders,
      chartItems,
      isEmpty: totalOrders === 0 || chartItems.length === 0,
    };
  }

  /**
   * Processes order summary data into formatted bar chart items for sales overview metrics
   */
  static getSalesMetricsChartData(summaryData?: IOrderSummaryData | null): {
    barData: IBarChartDataItem[];
    hasSalesData: boolean;
  } {
    const grossSales = summaryData?.sales?.completed_gross_sales ?? 0;
    const netSales = summaryData?.sales?.completed_net_sales ?? 0;
    const discounts = summaryData?.sales?.completed_discounts ?? 0;

    const barData: IBarChartDataItem[] = [
      {
        name: "Gross",
        value: grossSales,
        frontColor: COLORS.amount.gross,
        gradientColor: `${COLORS.amount.gross}80`,
      },
      {
        name: "Net",
        value: netSales,
        frontColor: COLORS.amount.net,
        gradientColor: `${COLORS.amount.net}80`,
      },
      {
        name: "Discount",
        value: discounts,
        frontColor: COLORS.amount.discount,
        gradientColor: `${COLORS.amount.discount}80`,
      },
    ];

    const hasSalesData = grossSales > 0 || netSales > 0 || discounts > 0;

    return { barData, hasSalesData };
  }

  /**
   * Processes order summary data into KPI metrics values
   */
  static getKPIMetrics(summaryData?: IOrderSummaryData | null): {
    grossSales: number;
    netSales: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    avgOrderValue: number;
  } {
    return {
      grossSales: summaryData?.sales?.completed_gross_sales ?? 0,
      netSales: summaryData?.sales?.completed_net_sales ?? 0,
      totalOrders: summaryData?.total_orders ?? 0,
      completedOrders: summaryData?.completed_orders ?? 0,
      pendingOrders:
        summaryData?.pending?.total ?? summaryData?.pending?.pending ?? 0,
      cancelledOrders: summaryData?.cancelled?.total ?? 0,
      avgOrderValue: summaryData?.sales?.average_order_value ?? 0,
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
