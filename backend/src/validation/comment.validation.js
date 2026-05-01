import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(5000, "Comment cannot exceed 5000 characters"),
  mentions: z
    .array(z.string())
    .optional()
    .default([]),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(5000, "Comment cannot exceed 5000 characters"),
  mentions: z
    .array(z.string())
    .optional()
    .default([]),
});
