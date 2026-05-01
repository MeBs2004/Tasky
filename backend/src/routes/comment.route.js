import express from "express";
import {
  getCommentsByTaskController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
} from "../controllers/comment.controller.js";

const commentRoutes = express.Router();

// Get all comments for a task
commentRoutes.get("/task/:taskId", getCommentsByTaskController);

// Create a comment
commentRoutes.post("/task/:taskId/create", createCommentController);

// Update a comment
commentRoutes.put("/:commentId/update", updateCommentController);

// Delete a comment
commentRoutes.delete("/:commentId/delete", deleteCommentController);

export default commentRoutes;
