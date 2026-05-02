const { Router } = require("express");
const {
  addTimeLogController,
  getTimeLogsByTaskController,
  getTimeLogsByProjectController,
  getTimeLogsByUserController,
  updateTimeLogController,
  deleteTimeLogController,
} = require("../controllers/timelog.controller");

const timeLogRoutes = Router();

// Add time log
timeLogRoutes.post(
  "/projects/:projectId/tasks/:taskId/create",
  addTimeLogController
);

// Get time logs for a task
timeLogRoutes.get("/tasks/:taskId", getTimeLogsByTaskController);

// Get time logs for a project
timeLogRoutes.get("/projects/:projectId", getTimeLogsByProjectController);

// Get time logs for current user
timeLogRoutes.get("/user/logs", getTimeLogsByUserController);

// Update time log
timeLogRoutes.put("/:timeLogId/update", updateTimeLogController);

// Delete time log
timeLogRoutes.delete("/:timeLogId/delete", deleteTimeLogController);

module.exports = timeLogRoutes;
