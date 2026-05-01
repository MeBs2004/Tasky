import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { HTTPSTATUS } from "../config/http.config.js";

// Get all comments for a task
export const getCommentsByTaskController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userId, workspaceId } = req.user;

    // Verify task exists and user has access
    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        new AppError("Task not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    if (task.workspace.toString() !== workspaceId) {
      return next(
        new AppError(
          "You don't have access to this task",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    const comments = await Comment.find({
      taskId,
      isDeleted: false,
    })
      .populate("userId", "name profilePicture email")
      .populate("mentions", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// Create a comment
export const createCommentController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content, mentions } = req.body;
    const { userId, workspaceId } = req.user;

    // Verify task exists and user has access
    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        new AppError("Task not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    if (task.workspace.toString() !== workspaceId) {
      return next(
        new AppError(
          "You don't have access to this task",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    const comment = new Comment({
      content,
      taskId,
      userId,
      mentions: mentions || [],
    });

    await comment.save();

    // Populate user details
    await comment.populate("userId", "name profilePicture email");
    await comment.populate("mentions", "name email profilePicture");

    res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Update a comment
export const updateCommentController = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content, mentions } = req.body;
    const { userId } = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(
        new AppError("Comment not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    // Only comment author can edit
    if (comment.userId.toString() !== userId) {
      return next(
        new AppError(
          "You can only edit your own comments",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    comment.content = content;
    comment.mentions = mentions || [];
    comment.edited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate("userId", "name profilePicture email");
    await comment.populate("mentions", "name email profilePicture");

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteCommentController = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(
        new AppError("Comment not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    // Only comment author or admin can delete
    if (comment.userId.toString() !== userId) {
      return next(
        new AppError(
          "You can only delete your own comments",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    comment.isDeleted = true;
    await comment.save();

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
