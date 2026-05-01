import io from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.connected) return;

    this.socket = io(API_BASE_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.connected = false;
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  // Task events
  onTaskCreated(callback) {
    this.socket?.on("task:created", callback);
  }

  onTaskUpdated(callback) {
    this.socket?.on("task:updated", callback);
  }

  onTaskDeleted(callback) {
    this.socket?.on("task:deleted", callback);
  }

  onTaskStatusChanged(callback) {
    this.socket?.on("task:status-changed", callback);
  }

  onTaskAssigned(callback) {
    this.socket?.on("task:assigned", callback);
  }

  // Comment events
  onCommentAdded(callback) {
    this.socket?.on("comment:added", callback);
  }

  onCommentUpdated(callback) {
    this.socket?.on("comment:updated", callback);
  }

  onCommentDeleted(callback) {
    this.socket?.on("comment:deleted", callback);
  }

  // Member events
  onMemberJoined(callback) {
    this.socket?.on("member:joined", callback);
  }

  onMemberLeft(callback) {
    this.socket?.on("member:left", callback);
  }

  // Notification events
  onNotificationReceived(callback) {
    this.socket?.on("notification:received", callback);
  }

  // Project events
  onProjectCreated(callback) {
    this.socket?.on("project:created", callback);
  }

  onProjectUpdated(callback) {
    this.socket?.on("project:updated", callback);
  }

  onProjectDeleted(callback) {
    this.socket?.on("project:deleted", callback);
  }

  // Remove listeners
  removeListener(event) {
    this.socket?.off(event);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  // Emit events
  joinWorkspace(workspaceId) {
    this.socket?.emit("workspace:join", { workspaceId });
  }

  leaveWorkspace(workspaceId) {
    this.socket?.emit("workspace:leave", { workspaceId });
  }

  joinTask(taskId) {
    this.socket?.emit("task:join", { taskId });
  }

  leaveTask(taskId) {
    this.socket?.emit("task:leave", { taskId });
  }
}

export const socketService = new SocketService();
