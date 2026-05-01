require("dotenv/config");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { config } = require("./config/app.config");
const connectDatabase = require("./config/database.config");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { HTTPSTATUS } = require("./config/http.config");
const { asyncHandler } = require("./middlewares/asyncHandler.middleware");
require("./config/passport.config");
const passport = require("passport");
const { BadRequestException } = require("./utils/appError");
const { ErrorCodeEnum } = require("./enums/error-code.enum");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.routes");
const isAuthenticated = require("./middlewares/isAuthenticated.middleware");
const workspaceRoutes = require("./routes/workspace.route");
const memberRoutes = require("./routes/member.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.route");
const commentRoutes = require("./routes/comment.route");
const notificationRoutes = require("./routes/notification.route");
const timeLogRoutes = require("./routes/timelog.route");
const auditLogRoutes = require("./routes/auditlog.route");
const { passportAuthenticationJWT } = require("./config/passport.config");
const autoSeedRoles = require("./utils/auto-seed-roles");
const { initializeSocket } = require("./config/socket.config");

const app = express();
const server = http.createServer(app);
const BASE_PATH = config.BASE_PATH;

// Initialize Socket.io
initializeSocket(server);

// 🚀 CRITICAL: Enable trust proxy for Render HTTPS deployment
// Without this, secure cookies are silently dropped behind the proxy
app.set("trust proxy", 1);

// CORS Configuration - Explicit origin matching deployed frontend
const corsOptions = {
  origin:
    config.NODE_ENV === "production"
      ? "https://tasky-app.onrender.com"
      : "http://localhost:5173",
  credentials: true,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicitly handle preflight (OPTIONS) requests
app.options("*", cors(corsOptions));

// Body parsers - AFTER CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Tasky API Running",
    status: "healthy",
    version: "1.0.0",
  });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticationJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, passportAuthenticationJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, passportAuthenticationJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, passportAuthenticationJWT, projectRoutes);
app.use(`${BASE_PATH}/task`, passportAuthenticationJWT, taskRoutes);
app.use(`${BASE_PATH}/comment`, passportAuthenticationJWT, commentRoutes);
app.use(`${BASE_PATH}/notification`, passportAuthenticationJWT, notificationRoutes);
app.use(`${BASE_PATH}/timelog`, passportAuthenticationJWT, timeLogRoutes);
app.use(`${BASE_PATH}/auditlog`, passportAuthenticationJWT, auditLogRoutes);

app.use(errorHandler);

server.listen(config.PORT, async () => {
  console.log(
    `Server listening on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
  await connectDatabase();
  await autoSeedRoles();
  console.log("Socket.io initialized for real-time updates");
});
