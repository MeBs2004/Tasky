const { TaskPriorityEnum, TaskStatusEnum } = require("../enums/task.enum");
const MemberModel = require("../models/member.model");
const ProjectModel = require("../models/project.model");
const TaskModel = require("../models/task.model");
const { BadRequestException, NotFoundException } = require("../utils/appError");

const createTaskService = async (workspaceId, projectId, userId, body) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;
  const project = await ProjectModel.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException("Project not found");
  }

  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId: workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new NotFoundException(
        "Assigned user is not a member of the workspace",
      );
    }
  }

  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    dueDate,
    workspace: workspaceId,
    project: projectId,
    createdBy: userId,
  });

  await task.save();

  return { task };
};

const updateTaskService = async (workspaceId, projectId, taskId, body) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace",
    );
  }

  const task = await TaskModel.findById(taskId);
  if (!task || task.project.toString() !== projectId) {
    throw new NotFoundException(
      "Task not found or task is not part of this project",
    );
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
    },
    { new: true },
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { task: updatedTask };
};

const getAllTasksService = async (workspaceId, filters, pagination) => {
  const query = { workspace: workspaceId };
  const { projectId, status, priority, assignedTo, dueDate, keyword } = filters;
  const { pageSize, pageNumber } = pagination;

  if (projectId) {
    query.project = projectId;
  }

  if (status && status.length > 0) {
    query.status = { $in: status };
  }

  if (priority && priority.length > 0) {
    query.priority = { $in: priority };
  }

  if (assignedTo && assignedTo.length > 0) {
    query.assignedTo = { $in: assignedTo };
  }

  if (keyword) {
    query.title = { $regex: keyword, $options: "i" };
  }

  if (dueDate) {
    query.dueDate = {
      $eq: new Date(dueDate),
    };
  }

  const skip = (pageNumber - 1) * pageSize;
  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name"),
    TaskModel.countDocuments(query),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    tasks,
    paginaion: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

const getTaskByIdService = async (workspaceId, projectId, taskId) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException("Project not found");
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
    workspace: workspaceId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found");
  }

  return {
    task,
  };
};

const deleteTaskByIdService = async (workspaceId, taskId) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });
  if (!task) {
    throw new NotFoundException("Task not found or does not belong to this");
  }

  return { task };
};

module.exports = {
  createTaskService,
  updateTaskService,
  getAllTasksService,
  getTaskByIdService,
  deleteTaskByIdService,
};
