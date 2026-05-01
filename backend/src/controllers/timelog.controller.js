import TimeLog from "../models/timelog.model.js";
import Task from "../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { HTTPSTATUS } from "../config/http.config.js";

// Add time log
export const addTimeLogController = async (req, res, next) => {
  try {
    const { taskId, projectId } = req.params;
    const { duration, description, date } = req.body;
    const { userId, workspaceId } = req.user;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        new AppError("Task not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    // Verify user has access
    if (task.workspace.toString() !== workspaceId) {
      return next(
        new AppError(
          "You don't have access to this task",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    const timeLog = new TimeLog({
      taskId,
      userId,
      workspaceId,
      projectId,
      duration,
      description,
      date: date || new Date(),
    });

    await timeLog.save();

    res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: "Time log added successfully",
      data: timeLog,
    });
  } catch (error) {
    next(error);
  }
};

// Get time logs for a task
export const getTimeLogsByTaskController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userId, workspaceId } = req.user;

    // Verify task exists
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

    const timeLogs = await TimeLog.find({ taskId })
      .populate("userId", "name profilePicture email")
      .sort({ createdAt: -1 });

    const totalDuration = timeLogs.reduce((sum, log) => sum + log.duration, 0);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: timeLogs,
      summary: {
        totalDuration,
        totalHours: (totalDuration / 60).toFixed(2),
        logsCount: timeLogs.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get time logs for a project
export const getTimeLogsByProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, workspaceId } = req.user;
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    const query = { projectId, workspaceId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const timeLogs = await TimeLog.find(query)
      .populate("userId", "name profilePicture email")
      .populate("taskId", "title taskcode")
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await TimeLog.countDocuments(query);
    const totalDuration = timeLogs.reduce((sum, log) => sum + log.duration, 0);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: timeLogs,
      summary: {
        totalDuration,
        totalHours: (totalDuration / 60).toFixed(2),
        logsCount: timeLogs.length,
      },
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get time logs by user
export const getTimeLogsByUserController = async (req, res, next) => {
  try {
    const { workspaceId } = req.user;
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    const query = { workspaceId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const timeLogs = await TimeLog.find(query)
      .populate("userId", "name profilePicture email")
      .populate("taskId", "title taskcode")
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await TimeLog.countDocuments(query);
    const totalDuration = timeLogs.reduce((sum, log) => sum + log.duration, 0);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: timeLogs,
      summary: {
        totalDuration,
        totalHours: (totalDuration / 60).toFixed(2),
        logsCount: timeLogs.length,
      },
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update time log
export const updateTimeLogController = async (req, res, next) => {
  try {
    const { timeLogId } = req.params;
    const { duration, description } = req.body;
    const { userId } = req.user;

    const timeLog = await TimeLog.findById(timeLogId);
    if (!timeLog) {
      return next(
        new AppError("Time log not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    // Only creator can edit
    if (timeLog.userId.toString() !== userId) {
      return next(
        new AppError(
          "You can only edit your own time logs",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    timeLog.duration = duration || timeLog.duration;
    timeLog.description = description || timeLog.description;

    await timeLog.save();

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Time log updated successfully",
      data: timeLog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete time log
export const deleteTimeLogController = async (req, res, next) => {
  try {
    const { timeLogId } = req.params;
    const { userId } = req.user;

    const timeLog = await TimeLog.findById(timeLogId);
    if (!timeLog) {
      return next(
        new AppError("Time log not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    // Only creator can delete
    if (timeLog.userId.toString() !== userId) {
      return next(
        new AppError(
          "You can only delete your own time logs",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    await TimeLog.findByIdAndDelete(timeLogId);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Time log deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
