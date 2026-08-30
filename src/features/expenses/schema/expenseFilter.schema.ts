// 3. External libraries
import { z } from "zod";

export const expenseFilterSchema = z.object({
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
  payment_method: z.string().optional(),
  order_by: z.string().optional(),
});

export type IExpenseFilterValues = z.infer<typeof expenseFilterSchema>;
