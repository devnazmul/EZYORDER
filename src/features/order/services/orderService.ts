import { IOrderFilterValues } from "../types/orderFilter.types";

export class OrderService {
  /**
   * Transforms debounced search query and local filter state into
   * query parameters suitable for the API request.
   */
  static buildAllOrdersQueryParams(
    debouncedSearchQuery: string,
    filterValues: IOrderFilterValues,
  ): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    const directFilters = [
      "exclude_status",
      "date_filter",
      "is_schedule_order",
      "dish_ids",
      "dish_name",
      "is_delay",
    ] as const;

    for (const key of directFilters) {
      if (filterValues[key]) {
        params[key] = filterValues[key];
      }
    }

    const search = debouncedSearchQuery.trim();
    if (search) {
      params.order_id = search;
    }

    if (filterValues.status && Array.isArray(filterValues.status)) {
      const activeStatuses = filterValues.status.filter(
        (s: string) => s !== "all",
      );
      if (activeStatuses.length > 0) {
        params.status = activeStatuses;
      }
    }

    if (filterValues.payment_status && filterValues.payment_status !== "all") {
      params.payment_status = [filterValues.payment_status];
    }

    if (filterValues.order_type && Array.isArray(filterValues.order_type)) {
      const activeTypes = filterValues.order_type.filter(
        (t: string) => t !== "all",
      );
      if (activeTypes.length > 0) {
        params.order_type = activeTypes;
      }
    }

    const customerName = filterValues.customer_name?.trim();
    if (customerName) {
      params.customer_name = customerName;
    }

    const customerPhone = filterValues.customer_phone?.trim();
    if (customerPhone) {
      params.customer_phone = customerPhone;
    }

    const tableNum = filterValues.table_number?.trim();
    if (tableNum) {
      params.table_number = tableNum;
    }

    const dateRange = filterValues.date_range;
    if (dateRange) {
      if (dateRange.start) params.from_date = dateRange.start;
      if (dateRange.end) params.to_date = dateRange.end;
    }

    const amtRange = filterValues.amount_range;
    if (amtRange) {
      if (amtRange.min) params.min_amount = amtRange.min;
      if (amtRange.max) params.max_amount = amtRange.max;
    }

    return params;
  }
}
