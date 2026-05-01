const { Router } = require("express");
const {
  changeWorkspaceMemberRoleController,
  createWorkSpaceController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkSpaceMembersController,
  updateWorkspaceByIdController,
} = require("../controllers/workspace.controller");

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkSpaceController);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

workspaceRoutes.get("/:id", getWorkspaceByIdController);

workspaceRoutes.get("/members/:id", getWorkSpaceMembersController);

workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);

workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController,
);

workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);

workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);

module.exports = workspaceRoutes;
