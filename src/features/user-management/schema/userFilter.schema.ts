// 3. External libraries
import { z } from "zod";

export const userFilterSchema = z.object({
  role: z.string().optional(),
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;
