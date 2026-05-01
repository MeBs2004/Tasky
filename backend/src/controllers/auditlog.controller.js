import AuditLog from "../models/auditlog.model.js";
import { AppError } from "../utils/appError.js";
import { HTTPSTATUS } from "../config/http.config.js";

// Get audit logs
export const getAuditLogsController = async (req, res, next) => {
  try {
    const { workspaceId, userId: requesterUserId } = req.user;
    const { resourceType, action, startDate, endDate, limit = 50, page = 1 } = req.query;

    const query = { workspaceId };

    if (resourceType) {
      query.resourceType = resourceType;
    }

    if (action) {
      query.action = action;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .populate("userId", "name profilePicture email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await AuditLog.countDocuments(query);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: logs,
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

// Get audit logs for a specific resource
export const getResourceAuditLogsController = async (req, res, next) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { workspaceId } = req.user;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({
      workspaceId,
      resourceType,
      resourceId,
    })
      .populate("userId", "name profilePicture email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await AuditLog.countDocuments({
      workspaceId,
      resourceType,
      resourceId,
    });

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: logs,
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

// Get user activity
export const getUserActivityController = async (req, res, next) => {
  try {
    const { workspaceId } = req.user;
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({
      workspaceId,
      userId,
    })
      .populate("userId", "name profilePicture email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await AuditLog.countDocuments({
      workspaceId,
      userId,
    });

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: logs,
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
