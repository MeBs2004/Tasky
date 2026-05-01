const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  createProjectSchema,
  projectIdSchema,
  updatedProjectSchema,
} = require("../validation/project.validation");
const { workspaceIdSchema } = require("../validation/workspace.validation");
const { getMemberRoleWorkspace } = require("../services/member.service");
const { roleGuard } = require("../utils/roleGuard");
const { Permissions } = require("../enums/role.enum");
const {
  createProjectService,
  deleteProjectByIdAndWorkspaceIdService,
  getAllProjectsWorkspaceService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  updateProjectByIdAndWorkspaceIdService,
} = require("../services/project.service");
const { HTTPSTATUS } = require("../config/http.config");

const createProjectController = asyncHandler(async (req, res, next) => {
  const body = createProjectSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_PROJECT]);
  const { project } = await createProjectService(userId, workspaceId, body);
  return res.status(HTTPSTATUS.OK).json({
    message: "Project created successfully",
    project,
  });
});

const getAllProjectsWorkspaceController = asyncHandler(
  async (req, res, next) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const { projects, totalProjectsCount, totalPages, skip } =
      await getAllProjectsWorkspaceService(workspaceId, pageSize, pageNumber);
    return res.status(HTTPSTATUS.OK).json({
      message: "Projects fetched successfully",
      projects,
      pagination: {
        totalProjectsCount,
        pageSize,
        pageNumber,
        totalPages,
        skip,
        limit: pageSize,
      },
    });
  },
);

const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req, res, next) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const { project } = await getProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId,
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      project,
    });
  },
);

const getProjectAnalyticsController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const projectId = projectIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);
  const { analytics } = await getProjectAnalyticsService(
    projectId,
    workspaceId,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Project analytics fetched successfully",
    analytics,
  });
});

const updateProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req, res, next) => {
    const userId = req.user?._id;
    const body = updatedProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_PROJECT]);
    const { project } = await updateProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId,
      body,
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Project updated successfully",
      project,
    });
  },
);

const deleteProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req, res, next) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);
    const { project } = await deleteProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId,
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Project deleted successfully",
      project,
    });
  },
);

module.exports = {
  createProjectController,
  getAllProjectsWorkspaceController,
  getProjectByIdAndWorkspaceIdController,
  getProjectAnalyticsController,
  updateProjectByIdAndWorkspaceIdController,
  deleteProjectByIdAndWorkspaceIdController,
};
