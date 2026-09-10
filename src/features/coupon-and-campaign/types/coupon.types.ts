import type { IDish } from "@/types";

export type DiscountType = "fixed" | "percentage";

export interface ICouponDishPivot {
  coupon_id: number;
  dish_id: number;
}

export type ICouponDish = Partial<IDish> & {
  pivot?: ICouponDishPivot;
};

export interface ICoupon {
  id: number;
  business_id: number;
  name: string;
  code: string;
  discount_type: DiscountType;
  discount_amount: string;
  min_total?: string | null;
  max_total?: string | null;
  redemptions: string;
  customer_redemptions: string;
  coupon_start_date: string;
  coupon_end_date: string;
  is_auto_apply: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  dishes?: ICouponDish[];
}
