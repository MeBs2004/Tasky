import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task ID is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace ID is required"],
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration (in minutes) is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: new Date(),
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
timeLogSchema.index({ taskId: 1, userId: 1 });
timeLogSchema.index({ workspaceId: 1, date: -1 });
timeLogSchema.index({ userId: 1, date: -1 });

const TimeLog = mongoose.model("TimeLog", timeLogSchema);

export default TimeLog;
