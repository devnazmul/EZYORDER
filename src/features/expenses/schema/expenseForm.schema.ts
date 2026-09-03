// 3. External libraries
import { z } from "zod";

export const expenseFormSchema = z.object({
  id: z.number().optional(),
  amount: z
    .union([z.string(), z.number()])
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    })
    .transform(Number),
  expense_type: z.string().min(1, "Expense type is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  paid_by: z.string().min(1, "Paid by is required"),
  restaurant_id: z.number({ message: "Restaurant ID is required" }),
  note: z.string().optional().default(""),
  description: z.string().optional().default(""),
  is_active: z.boolean().default(true),
  reciepts: z.array(z.string()).default([]),
});

export type IExpenseFormData = z.infer<typeof expenseFormSchema>;
