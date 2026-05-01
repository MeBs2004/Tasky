const { z } = require("zod");

const nameSchmea = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(255);

const descriptionSchema = z.string().trim().optional();

const workspaceIdSchema = z.string().trim().min(1, {
  message: "Workspace ID is required",
});

const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

const createWorkSpaceSchema = z.object({
  name: nameSchmea,
  description: descriptionSchema,
});

const updateWorkSpaceSchema = z.object({
  name: nameSchmea,
  description: descriptionSchema,
});

module.exports = {
  nameSchmea,
  descriptionSchema,
  workspaceIdSchema,
  changeRoleSchema,
  createWorkSpaceSchema,
  updateWorkSpaceSchema,
};
