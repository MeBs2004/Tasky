const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  changeRoleSchema,
  createWorkSpaceSchema,
  updateWorkSpaceSchema,
  workspaceIdSchema,
} = require("../validation/workspace.validation");
const { HTTPSTATUS } = require("../config/http.config");
const {
  changeMemberRoleService,
  createWorkSpaceService,
  deleteWorkspaceByIdService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  updateWorkspaceByIdService,
} = require("../services/workspace.service");
const { getMemberRoleWorkspace } = require("../services/member.service");
const { Permissions } = require("../enums/role.enum");
const { roleGuard } = require("../utils/roleGuard");

const createWorkSpaceController = asyncHandler(async (req, res, next) => {
  const body = createWorkSpaceSchema.parse(req.body);

  const userId = req.user?._id;

  const { workspace } = await createWorkSpaceService(userId, body);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Workspace created successfully",
    workspace,
  });
});

const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req, res, next) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User workspaces fetched successfully",
      workspaces,
    });
  },
);

const getWorkspaceByIdController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);

  const userId = req.user?._id;

  await getMemberRoleWorkspace(userId, workspaceId);

  const { workspace } = await getWorkspaceByIdService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "User workspace fetched successfully",
    workspace,
  });
});

const getWorkSpaceMembersController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);

  const userId = req.user?._id;

  const { role } = await getMemberRoleWorkspace(userId, workspaceId);

  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { members, roles } = await getWorkspaceMembersService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace members fetched successfully",
    members,
    roles,
  });
});

const getWorkspaceAnalyticsController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);
  const { analytics } = await getWorkspaceAnalyticsService(workspaceId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace analytics fetched successfully",
    analytics,
  });
});

const changeWorkspaceMemberRoleController = asyncHandler(
  async (req, res, next) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);
    const userId = req.user?._id;
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);
    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId,
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Member role changed successfully",
      member,
    });
  },
);

const updateWorkspaceByIdController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  const { name, description } = updateWorkSpaceSchema.parse(req.body);
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_WORKSPACE]);
  const { workspace } = await updateWorkspaceByIdService(
    workspaceId,
    name,
    description,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace updated successfully",
    workspace,
  });
});

const deleteWorkspaceByIdController = asyncHandler(async (req, res, next) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  const { role } = await getMemberRoleWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_WORKSPACE]);
  const { currentWorkspace } = await deleteWorkspaceByIdService(
    workspaceId,
    userId,
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace deleted successfully",
    currentWorkspace,
  });
});

module.exports = {
  createWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  getWorkSpaceMembersController,
  getWorkspaceAnalyticsController,
  changeWorkspaceMemberRoleController,
  updateWorkspaceByIdController,
  deleteWorkspaceByIdController,
};
