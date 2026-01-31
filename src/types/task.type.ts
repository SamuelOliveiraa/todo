import z from "zod";

const TaskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  completed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

const TaskPostSchema = z.object({
  title: z.string(),
  description: z.string()
});

const TaskPutSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional()
});

export type TaskPost = z.infer<typeof TaskPostSchema>;
export type TaskPut = z.infer<typeof TaskPutSchema>;
export type Task = z.infer<typeof TaskSchema>;
