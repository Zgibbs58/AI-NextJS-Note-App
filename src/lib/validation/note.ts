import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  content: z.string().optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
