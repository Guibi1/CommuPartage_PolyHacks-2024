import { z } from "zod";

export const newObjectSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(50),
    value: z.coerce.number().min(0).max(300),
    file: z.any(),
});
export type CreateObjectSchema = typeof newObjectSchema;
