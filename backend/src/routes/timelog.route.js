import express from "express";
import {
  addTimeLogController,
  getTimeLogsByTaskController,
  getTimeLogsByProjectController,
  getTimeLogsByUserController,
  updateTimeLogController,
  deleteTimeLogController,
} from "../controllers/timelog.controller.js";

const timeLogRoutes = express.Router();

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

export default timeLogRoutes;
