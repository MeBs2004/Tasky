const { Router } = require("express");
const {
  getAuditLogsController,
  getResourceAuditLogsController,
  getUserActivityController,
} = require("../controllers/auditlog.controller");

const auditLogRoutes = Router();

// Get all audit logs
auditLogRoutes.get("/", getAuditLogsController);

// Get resource audit logs
auditLogRoutes.get("/:resourceType/:resourceId", getResourceAuditLogsController);

// Get user activity
auditLogRoutes.get("/user/:userId", getUserActivityController);

module.exports = auditLogRoutes;
