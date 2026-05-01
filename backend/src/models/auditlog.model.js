import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace ID is required"],
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
      required: [true, "Action is required"],
      index: true,
    },
    resourceType: {
      type: String,
      enum: ["USER", "WORKSPACE", "PROJECT", "TASK", "MEMBER", "COMMENT"],
      required: [true, "Resource type is required"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Resource ID is required"],
      index: true,
    },
    resourceName: {
      type: String,
      default: null,
    },
    changes: {
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ workspaceId: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
