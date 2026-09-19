export type TableStatus = "free" | "occupied" | "reserved";

export interface ITable {
  id: number;
  restaurant_id?: number | null;
  status?: TableStatus;
  table_no?: number;
  table_number?: string;
  capacity?: number;
  area?: string | null;
  is_active?: boolean;
  order_id?: number | null;
  waiter_id?: number | null;
}

export interface ITableMatrixSummary {
  total?: number;
  free?: number;
  occupied?: number;
  reserved?: number;
  inactive?: number;
  pending_approval?: number;
  indoor?: number;
  outdoor?: number;
  rooftop?: number;
}
