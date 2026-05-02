const { Router } = require("express");
const {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} = require("../controllers/notification.controller");

const notificationRoutes = Router();

// Get all notifications
notificationRoutes.get("/", getNotificationsController);

// Get unread count
notificationRoutes.get("/unread/count", getUnreadCountController);

// Mark as read
notificationRoutes.put("/:notificationId/read", markAsReadController);

// Mark all as read
notificationRoutes.put("/all/read", markAllAsReadController);

// Delete notification
notificationRoutes.delete("/:notificationId/delete", deleteNotificationController);

module.exports = notificationRoutes;
