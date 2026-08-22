export interface ICampaignPivot {
  dish_id: number;
  campaign_id: number;
}

export interface ICampaign {
  id: number;
  business_id: number;
  name: string;
  type: string;
  discount_type: string | null;
  discount_amount: string;
  max_redemptions: number;
  customer_redemptions: number;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_start_time: string | null;
  campaign_end_time: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  spend_threshold: string | null;
  pivot?: ICampaignPivot;
}
