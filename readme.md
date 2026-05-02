# Tasky - Modern Team Task Management Platform

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18.20.8-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3.1-blue?logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.2.6-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v4.21.2-black?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Tasky** is a comprehensive team collaboration platform designed to streamline project management, task tracking, and team coordination. Built with modern technologies and best practices, it provides a seamless experience for teams of all sizes.

[Live Demo](#) • [Documentation](#project-structure) • [Contributing](#contributing) • [Report Bug](https://github.com/MeBs2004/Tasky/issues)

</div>

---

## 🎯 About Tasky

Tasky is a full-featured task management and collaboration platform that helps teams organize work, track progress, and collaborate effectively. Whether you're managing a small project team or coordinating across departments, Tasky provides the tools you need to stay organized and productive.

With real-time updates, intelligent task management, and comprehensive reporting, Tasky makes team collaboration intuitive and efficient.

---

## ✨ Key Features

### 📋 Task Management
- **Create & Organize Tasks** - Easily create tasks with descriptions, priorities, and due dates
- **Status Tracking** - Monitor task progress with multiple status options (Pending, In Progress, Completed, etc.)
- **Task Assignment** - Assign tasks to team members with automatic notifications
- **Priority Levels** - Set task priorities (Low, Medium, High, Critical) for better organization
- **Task Comments** - Collaborate on tasks with threaded comments and @mentions

### 👥 Team Collaboration
- **Workspace Management** - Create multiple workspaces for different teams or projects
- **Member Management** - Invite team members and manage roles and permissions
- **Role-Based Access** - Three-tier permission system (Owner, Admin, Member)
- **Real-Time Updates** - Instant notifications of changes via Socket.io

### 📊 Project Management
- **Multi-Project Support** - Manage multiple projects within a workspace
- **Project Dashboard** - Overview of all project metrics and recent activities
- **Team Members** - See who's working on what with a member overview
- **Statistics** - Track total tasks, pending tasks, overdue tasks, and completed tasks

### 🚀 Advanced Features
- **Time Tracking** - Log time spent on tasks with manual entry and timer functionality
- **Activity Audit Logs** - Complete audit trail of all user actions for compliance
- **Notifications** - Real-time notifications for task assignments, mentions, status changes
- **Advanced Filtering** - Filter tasks by status, priority, assignee, and date range
- **Account Management** - Support for email/password and Google OAuth authentication

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite 6.0.5
- **State Management**: Zustand 4.5.5 (client state), React Query 5.62.11 (server state)
- **UI Framework**: Radix UI with TailwindCSS 3.4.14
- **Form Handling**: React Hook Form 7.53.2 with Zod validation
- **HTTP Client**: Axios for API communication
- **Real-Time**: Socket.io-client 4.8.3
- **Styling**: TailwindCSS with custom components

### Backend
- **Runtime**: Node.js 18.20.8
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB 8.2.6 with Mongoose 8.9.2 ODM
- **Authentication**: Passport.js with JWT, Local, and Google strategies
- **Real-Time**: Socket.io 4.8.3
- **Security**: bcrypt 5.1.2, jsonwebtoken 9.1.2
- **Validation**: Custom validation schemas

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - v18.20.8 or higher
- **npm** - v9.0 or higher
- **MongoDB** - v8.2.6 or higher

---

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/MeBs2004/Tasky.git
cd Tasky

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Configuration

**Backend .env file:**
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tasky
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_ORIGIN=http://localhost:5173
```

**Frontend .env file:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Running Services

**Option 1: Automated (Recommended)**
```bash
bash /tmp/start-tasky.sh
```

**Option 2: Manual (3 Terminals)**

Terminal 1:
```bash
mkdir -p /tmp/mongodb_data
mongod --dbpath /tmp/mongodb_data
```

Terminal 2:
```bash
cd backend && NODE_ENV=development npm run dev
```

Terminal 3:
```bash
cd frontend && VITE_API_BASE_URL=http://localhost:8000/api npm run dev
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Database**: mongodb://localhost:27017

### Test Credentials
- **Email**: test@example.com
- **Password**: Password123!

---

## 📂 Project Structure

```
Tasky/
├── frontend/              # React SPA Application
│   ├── src/
│   │   ├── components/   # UI & feature components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # Context providers
│   │   ├── store/        # Zustand stores
│   │   └── lib/          # Utilities & API client
│   └── package.json
│
├── backend/               # Express API Server
│   ├── src/
│   │   ├── models/       # 11 MongoDB schemas
│   │   ├── routes/       # 10 API route files
│   │   ├── controllers/  # Business logic
│   │   ├── services/     # Data layer
│   │   ├── middlewares/  # Express middleware
│   │   ├── config/       # Configuration
│   │   └── utils/        # Helpers
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Models (11 Total)

| Model | Purpose |
|-------|---------|
| **User** | User accounts and profiles |
| **Workspace** | Team workspaces |
| **Member** | Workspace members with roles |
| **Project** | Projects within workspaces |
| **Task** | Tasks with status and priority |
| **Role** | Role definitions |
| **Comment** | Task comments with @mentions |
| **Notification** | Real-time notifications |
| **TimeLog** | Time tracking entries |
| **AuditLog** | Complete audit trail |
| **RolePermission** | Permission mappings |

---

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Role-based access control
- Audit logging
- Secure HTTP headers

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Logout

### Workspaces
- `GET /api/workspace` - List workspaces
- `POST /api/workspace` - Create workspace
- `PUT /api/workspace/:id` - Update workspace

### Projects
- `POST /api/project` - Create project
- `GET /api/project/workspace/:wsId` - List projects
- `PUT /api/project/:id` - Update project

### Tasks
- `POST /api/task` - Create task
- `GET /api/task/project/:projectId` - List tasks
- `PUT /api/task/:id` - Update task

### Comments, Notifications, Time Logs, Audit Logs
Complete endpoints available for all features.

---

## 🔄 Real-Time Features

Socket.io enabled for:
- Task updates in real-time
- Comment notifications
- Member status changes
- Project modifications
- Instant notifications

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add: amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Bug Reports

Found a bug? Report it on [GitHub Issues](https://github.com/MeBs2004/Tasky/issues)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Bharat Sharma**
- GitHub: [@MeBs2004](https://github.com/MeBs2004)
- Repository: [Tasky](https://github.com/MeBs2004/Tasky)

---

## 📚 Resources

- [Quick Start Guide](./QUICKSTART.md)
- [Node.js Docs](https://nodejs.org/docs/)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.io Docs](https://socket.io/docs/)

---

<div align="center">

**Made with ❤️ by Bharat Sharma**

⭐ Star this repo if you find it useful!

</div>
