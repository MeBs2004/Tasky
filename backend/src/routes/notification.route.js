import express from "express";
import {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();

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

export default notificationRoutes;
