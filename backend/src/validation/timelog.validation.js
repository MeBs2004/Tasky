import { z } from "zod";

export const addTimeLogSchema = z.object({
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration cannot exceed 480 minutes (8 hours)"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .default(""),
  date: z
    .string()
    .datetime()
    .optional(),
});

export const updateTimeLogSchema = z.object({
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration cannot exceed 480 minutes (8 hours)")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
