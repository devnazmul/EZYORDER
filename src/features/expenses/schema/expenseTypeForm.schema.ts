import { z } from "zod";

export const createExpenseTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  restaurant_id: z.number({ message: "Restaurant ID is required" }),
  is_active: z
    .union([z.boolean(), z.number(), z.string()])
    .transform(
      (val) => val === true || val === 1 || val === "1" || val === "active",
    )
    .default(true),
});

export const updateExpenseTypeSchema = createExpenseTypeSchema.extend({
  id: z.number({ message: "Expense Type ID is required" }),
});

export const expenseTypeFormSchema = createExpenseTypeSchema.extend({
  id: z.number().optional(),
});

export type ICreateExpenseTypeFormData = z.infer<
  typeof createExpenseTypeSchema
>;
export type IUpdateExpenseTypeFormData = z.infer<
  typeof updateExpenseTypeSchema
>;
export type IExpenseTypeFormData = z.infer<typeof expenseTypeFormSchema>;
