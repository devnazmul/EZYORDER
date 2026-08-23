export interface IOrderFilterValues {
  status: string[];
  payment_status: string;
  order_type: string[];
  customer_name: string;
  customer_phone: string;
  table_number: string;
  date_range: { start: string; end: string };
  amount_range: { min: string; max: string };
  exclude_status?: string;
  date_filter?: string;
  is_schedule_order?: string;
  dish_ids?: string;
  dish_name?: string;
  is_delay?: string;
}
