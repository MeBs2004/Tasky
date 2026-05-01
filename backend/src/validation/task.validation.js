const { z } = require("zod");
const { TaskPriorityEnum, TaskStatusEnum } = require("../enums/task.enum");

const titleSchema = z.string().trim().min(1).max(255);

const descriptionSchema = z.string().trim().optional();

const prioritySchema = z.enum(Object.values(TaskPriorityEnum));

const statusSchema = z.enum(Object.values(TaskStatusEnum));

const assignedToSchema = z.string().trim().min(1).nullable().optional();

const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: "Invalid date. please provide valide details",
  });

const taskIdSchema = z.string().trim().min(1);

const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

module.exports = {
  titleSchema,
  descriptionSchema,
  prioritySchema,
  statusSchema,
  assignedToSchema,
  dueDateSchema,
  taskIdSchema,
  createTaskSchema,
  updateTaskSchema,
};
