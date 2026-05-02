const { Router } = require("express");
const {
  getCommentsByTaskController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
} = require("../controllers/comment.controller");

const commentRoutes = Router();

// Get all comments for a task
commentRoutes.get("/task/:taskId", getCommentsByTaskController);

// Create a comment
commentRoutes.post("/task/:taskId/create", createCommentController);

// Update a comment
commentRoutes.put("/:commentId/update", updateCommentController);

// Delete a comment
commentRoutes.delete("/:commentId/delete", deleteCommentController);

module.exports = commentRoutes;
