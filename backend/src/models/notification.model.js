import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: [
        "TASK_ASSIGNED",
        "TASK_MENTIONED",
        "TASK_STATUS_CHANGED",
        "TASK_COMPLETED",
        "TASK_OVERDUE",
        "COMMENT_MENTIONED",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "WORKSPACE_INVITE",
        "PROJECT_CREATED",
        "PROJECT_DELETED",
      ],
      required: [true, "Notification type is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    relatedResourceType: {
      type: String,
      enum: ["TASK", "PROJECT", "WORKSPACE", "MEMBER", "COMMENT"],
      required: [true, "Related resource type is required"],
    },
    relatedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Related resource ID is required"],
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace ID is required"],
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Actor ID is required"],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for query optimization
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
