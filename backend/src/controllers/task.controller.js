const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} = require("../validation/task.validation");
const { projectIdSchema } = require("../validation/project.validation");
const { workspaceIdSchema } = require("../validation/workspace.validation");
const { getMemberRoleWorkspace } = require("../services/member.service");
const { roleGuard } = require("../utils/roleGuard");
const { Permissions } = require("../enums/role.enum");
const {
  createTaskService,
  deleteTaskByIdService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} = require("../services/task.service");
const { HTTPSTATUS } = require("../config/http.config");

const createTaskController = asyncHandler(async (req, res, nex) => {
  const userId = req.user?._id;
  const body = createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_TASK]);
  const { task } = await createTaskService(
    workspaceId,
    projectId,
    userId,
    body,
  );

  return res.status(HTTPSTATUS.OK).json({
    message: "Task created successfully",
    task,
  });
});

const updateTaskController = asyncHandler(async (req, res, nex) => {
  const userId = req.user?._id;
  const body = updateTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const taskId = taskIdSchema.parse(req.params.id);
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_TASK]);
  const { task } = await updateTaskService(
    workspaceId,
    projectId,
    taskId,
    body,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Task updated successfully",
    task,
  });
});

const getAllTasksController = asyncHandler(async (req, res, nex) => {
  const userId = req.user?._id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const filters = {
    projectId: req.query.projectId
      ? projectIdSchema?.parse(req.query.projectId)
      : undefined,
    status: req.query.status ? req.query.status?.split(",") : undefined,
    priority: req.query.priority ? req.query.priority?.split(",") : undefined,
    assignedTo: req.query.assignedTo
      ? req.query.assignedTo?.split(",")
      : undefined,
    dueDate: req.query.dueDate || undefined,
    keyword: req.query.keyword || undefined,
  };

  const pagination = {
    pageSize: parseInt(req.query.pageSize) || 10,
    pageNumber: parseInt(req.query.pageNumber) || 1,
  };

  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);
  const { tasks, paginaion } = await getAllTasksService(
    workspaceId,
    filters,
    pagination,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "All Tasks fetched successfully",
    tasks,
    paginaion,
  });
});

const getTaskByIdController = asyncHandler(async (req, res, nex) => {
  const userId = req.user?._id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);
  const { task } = await getTaskByIdService(workspaceId, projectId, taskId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Task fetched successfully",
    task,
  });
});

const deleteTaskByIdController = asyncHandler(async (req, res, nex) => {
  const userId = req.user?._id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const taskId = taskIdSchema.parse(req.params.id);
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_TASK]);
  const { task } = await deleteTaskByIdService(workspaceId, taskId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Task deleted successfully",
    task,
  });
});

module.exports = {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTaskByIdController,
  deleteTaskByIdController,
};
