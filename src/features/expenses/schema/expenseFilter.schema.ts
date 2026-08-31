// 3. External libraries
import { z } from "zod";

export const expenseFilterSchema = z.object({
  period: z.string().optional(),
  date_range: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  amount_range: z
    .object({
      min: z.string().optional(),
      max: z.string().optional(),
    })
    .optional(),
  expense_type: z
    .union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))])
    .optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
  paid_by: z.string().optional(),
  order_by: z.string().optional(),
});

export type IExpenseFilterValues = z.infer<typeof expenseFilterSchema>;
