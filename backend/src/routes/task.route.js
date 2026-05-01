const { Router } = require("express");
const {
  createTaskController,
  deleteTaskByIdController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} = require("../controllers/task.controller");

const taskRoutes = Router();

taskRoutes.post(
  "/projects/:projectId/workspace/:workspaceId/create",
  createTaskController,
);

taskRoutes.put(
  "/:id/projects/:projectId/workspace/:workspaceId/update",
  updateTaskController,
);

taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

taskRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController,
);

taskRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteTaskByIdController,
);

module.exports = taskRoutes;
