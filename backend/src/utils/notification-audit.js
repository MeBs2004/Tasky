import Notification from "../models/notification.model.js";
import AuditLog from "../models/auditlog.model.js";

/**
 * Create a notification
 */
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * Create an audit log
 */
export const createAuditLog = async (auditData) => {
  try {
    const auditLog = new AuditLog(auditData);
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

/**
 * Notify task assignment
 */
export const notifyTaskAssignment = async (
  taskId,
  assignedUserId,
  assignedByUserId,
  workspaceId,
  taskTitle
) => {
  return createNotification({
    userId: assignedUserId,
    type: "TASK_ASSIGNED",
    title: "Task Assigned",
    message: `You have been assigned a task: ${taskTitle}`,
    relatedResourceType: "TASK",
    relatedResourceId: taskId,
    workspaceId,
    actorId: assignedByUserId,
  });
};

/**
 * Notify task status change
 */
export const notifyTaskStatusChange = async (
  taskId,
  assignedUserId,
  changedByUserId,
  workspaceId,
  taskTitle,
  newStatus
) => {
  return createNotification({
    userId: assignedUserId,
    type: "TASK_STATUS_CHANGED",
    title: "Task Status Updated",
    message: `Task "${taskTitle}" status changed to ${newStatus}`,
    relatedResourceType: "TASK",
    relatedResourceId: taskId,
    workspaceId,
    actorId: changedByUserId,
    metadata: { newStatus },
  });
};

/**
 * Notify task completion
 */
export const notifyTaskCompletion = async (
  taskId,
  assignedUserId,
  workspaceId,
  taskTitle,
  completedByUserId
) => {
  return createNotification({
    userId: assignedUserId,
    type: "TASK_COMPLETED",
    title: "Task Completed",
    message: `Task "${taskTitle}" has been completed`,
    relatedResourceType: "TASK",
    relatedResourceId: taskId,
    workspaceId,
    actorId: completedByUserId,
  });
};

/**
 * Notify task overdue
 */
export const notifyTaskOverdue = async (
  taskId,
  assignedUserId,
  workspaceId,
  taskTitle
) => {
  return createNotification({
    userId: assignedUserId,
    type: "TASK_OVERDUE",
    title: "Task Overdue",
    message: `Task "${taskTitle}" is overdue`,
    relatedResourceType: "TASK",
    relatedResourceId: taskId,
    workspaceId,
    actorId: null,
  });
};

/**
 * Notify comment mention
 */
export const notifyCommentMention = async (
  commentId,
  mentionedUserId,
  mentionedByUserId,
  workspaceId,
  taskTitle
) => {
  return createNotification({
    userId: mentionedUserId,
    type: "COMMENT_MENTIONED",
    title: "Mentioned in Comment",
    message: `You were mentioned in a comment on task "${taskTitle}"`,
    relatedResourceType: "COMMENT",
    relatedResourceId: commentId,
    workspaceId,
    actorId: mentionedByUserId,
  });
};

/**
 * Notify member added
 */
export const notifyMemberAdded = async (
  workspaceId,
  newMemberId,
  addedByUserId
) => {
  return createNotification({
    userId: newMemberId,
    type: "MEMBER_ADDED",
    title: "Added to Workspace",
    message: "You have been added to a workspace",
    relatedResourceType: "MEMBER",
    relatedResourceId: newMemberId,
    workspaceId,
    actorId: addedByUserId,
  });
};

/**
 * Log audit trail for create action
 */
export const logAuditCreate = async (
  userId,
  workspaceId,
  resourceType,
  resourceId,
  resourceName,
  newValue
) => {
  return createAuditLog({
    userId,
    workspaceId,
    action: "CREATE",
    resourceType,
    resourceId,
    resourceName,
    changes: { newValue },
    status: "SUCCESS",
  });
};

/**
 * Log audit trail for update action
 */
export const logAuditUpdate = async (
  userId,
  workspaceId,
  resourceType,
  resourceId,
  resourceName,
  oldValue,
  newValue
) => {
  return createAuditLog({
    userId,
    workspaceId,
    action: "UPDATE",
    resourceType,
    resourceId,
    resourceName,
    changes: { oldValue, newValue },
    status: "SUCCESS",
  });
};

/**
 * Log audit trail for delete action
 */
export const logAuditDelete = async (
  userId,
  workspaceId,
  resourceType,
  resourceId,
  resourceName,
  deletedValue
) => {
  return createAuditLog({
    userId,
    workspaceId,
    action: "DELETE",
    resourceType,
    resourceId,
    resourceName,
    changes: { oldValue: deletedValue },
    status: "SUCCESS",
  });
};

/**
 * Log audit trail for login action
 */
export const logAuditLogin = async (userId, workspaceId, ipAddress) => {
  return createAuditLog({
    userId,
    workspaceId,
    action: "LOGIN",
    resourceType: "USER",
    resourceId: userId,
    ipAddress,
    status: "SUCCESS",
  });
};
