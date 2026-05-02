const Notification = require("../models/notification.model");
const { AppError } = require("../utils/appError");
const { HTTPSTATUS } = require("../config/http.config");

// Get all notifications for a user
const getNotificationsController = async (req, res, next) => {
  try {
    const { userId, workspaceId } = req.user;
    const { read, limit = 20, page = 1 } = req.query;

    const query = { userId, workspaceId };
    if (read !== undefined) {
      query.read = read === "true";
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .populate("actorId", "name profilePicture email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Notification.countDocuments(query);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      data: notifications,
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

// Get unread notification count
const getUnreadCountController = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.status(HTTPSTATUS.OK).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsReadController = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.user;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return next(
        new AppError("Notification not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    if (notification.userId.toString() !== userId) {
      return next(
        new AppError(
          "You don't have access to this notification",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsReadController = async (req, res, next) => {
  try {
    const { userId, workspaceId } = req.user;

    await Notification.updateMany(
      { userId, workspaceId, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
const deleteNotificationController = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.user;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return next(
        new AppError("Notification not found", HTTPSTATUS.NOT_FOUND)
      );
    }

    if (notification.userId.toString() !== userId) {
      return next(
        new AppError(
          "You don't have access to this notification",
          HTTPSTATUS.UNAUTHORIZED
        )
      );
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
};
