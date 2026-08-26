import { IOrdersReportParams } from "../types";
import { IOrderReportFilterValues } from "../state/ordersReport.reducer";

export class ReportsService {
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

    return p;
  }
}
