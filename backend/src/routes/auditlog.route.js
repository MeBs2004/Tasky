import express from "express";
import {
  getAuditLogsController,
  getResourceAuditLogsController,
  getUserActivityController,
} from "../controllers/auditlog.controller.js";

const auditLogRoutes = express.Router();

// Get all audit logs
auditLogRoutes.get("/", getAuditLogsController);

// Get resource audit logs
auditLogRoutes.get("/:resourceType/:resourceId", getResourceAuditLogsController);

// Get user activity
auditLogRoutes.get("/user/:userId", getUserActivityController);

export default auditLogRoutes;
