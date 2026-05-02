const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { config } = require("./app.config");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        config.NODE_ENV === "production"
          ? "https://tasky-app.onrender.com"
          : "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication token required"));
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.userId = decoded.id;
      socket.workspaceId = decoded.workspaceId;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Connection event
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join workspace
    socket.on("workspace:join", (data) => {
      const { workspaceId } = data;
      socket.join(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} joined workspace ${workspaceId}`);
    });

    // Leave workspace
    socket.on("workspace:leave", (data) => {
      const { workspaceId } = data;
      socket.leave(`workspace:${workspaceId}`);
    });

    // Join task
    socket.on("task:join", (data) => {
      const { taskId } = data;
      socket.join(`task:${taskId}`);
      socket.emit("notification:received", {
        type: "TASK_JOINED",
        message: "You are now following this task",
      });
    });

    // Leave task
    socket.on("task:leave", (data) => {
      const { taskId } = data;
      socket.leave(`task:${taskId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => io;

// Emit events
const emitTaskCreated = (workspaceId, taskData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("task:created", taskData);
  }
};

const emitTaskUpdated = (workspaceId, taskId, taskData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("task:updated", taskData);
    io.to(`task:${taskId}`).emit("task:updated", taskData);
  }
};

const emitTaskDeleted = (workspaceId, taskId) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("task:deleted", { taskId });
    io.to(`task:${taskId}`).emit("task:deleted", { taskId });
  }
};

const emitTaskStatusChanged = (workspaceId, taskId, status) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("task:status-changed", {
      taskId,
      status,
    });
    io.to(`task:${taskId}`).emit("task:status-changed", { status });
  }
};

const emitTaskAssigned = (workspaceId, taskId, assignedTo) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("task:assigned", {
      taskId,
      assignedTo,
    });
  }
};

const emitCommentAdded = (workspaceId, taskId, commentData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("comment:added", {
      taskId,
      ...commentData,
    });
    io.to(`task:${taskId}`).emit("comment:added", commentData);
  }
};

const emitCommentUpdated = (workspaceId, taskId, commentData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("comment:updated", {
      taskId,
      ...commentData,
    });
    io.to(`task:${taskId}`).emit("comment:updated", commentData);
  }
};

const emitCommentDeleted = (workspaceId, taskId, commentId) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("comment:deleted", {
      taskId,
      commentId,
    });
    io.to(`task:${taskId}`).emit("comment:deleted", { commentId });
  }
};

const emitNotification = (userId, notificationData) => {
  if (io) {
    io.to(`user:${userId}`).emit("notification:received", notificationData);
  }
};

const emitMemberJoined = (workspaceId, memberData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("member:joined", memberData);
  }
};

const emitMemberLeft = (workspaceId, memberId) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("member:left", { memberId });
  }
};

const emitProjectCreated = (workspaceId, projectData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("project:created", projectData);
  }
};

const emitProjectUpdated = (workspaceId, projectData) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("project:updated", projectData);
  }
};

const emitProjectDeleted = (workspaceId, projectId) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit("project:deleted", { projectId });
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
  emitTaskStatusChanged,
  emitTaskAssigned,
  emitCommentAdded,
  emitCommentUpdated,
  emitCommentDeleted,
  emitNotification,
  emitMemberJoined,
  emitMemberLeft,
  emitProjectCreated,
  emitProjectUpdated,
  emitProjectDeleted,
};
