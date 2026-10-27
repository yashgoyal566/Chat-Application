<div align="center">

# 💬 Chat Application (MERN Chat Pro)

A modern, high-performance, real-time messaging web application built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Socket.IO**, and **Tailwind CSS**.

Featuring a WhatsApp/iMessage-inspired UI, instant real-time delivery, group conversations, rich text formatting, message pinning, unread counters, and responsive design across all devices.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Appwrite%20Cloud-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://chat-application.appwrite.network/)
[![Backend Status](https://img.shields.io/badge/Backend%20API-Render%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://chat-application-1-brgc.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

[![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS%204-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-433e38?style=flat-square)](https://github.com/pmndrs/zustand)
[![Node.js](https://img.shields.io/badge/Node.js%20v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express%20v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO%20v4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

---

### 🌐 [Explore the Live Web App](https://chat-application.appwrite.network/)

</div>

<br />

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
- [API Reference](#-api-reference)
- [Socket.IO Events](#-socketio-events)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Chat Application** provides a real-time messaging experience engineered with performance, security, and responsive UX in mind. The frontend is built on **React 19** with **Vite** and **Tailwind CSS v4**, delivering animations via **Motion** and global state management through lightweight **Zustand** stores. The backend utilizes **Express 5** and **Socket.IO 4** running with room-based pub/sub routing, reconnection recovery, and authenticated sessions via HTTP-only JWT cookies.

---

## ✨ Key Features

- **⚡ Instant Real-Time Messaging**: Real-time bi-directional messaging powered by Socket.IO rooms with auto-reconnection and recovery.
- **👥 1-on-1 & Group Chats**: Seamlessly start private direct conversations or create multi-member groups with dedicated avatars and descriptions.
- **📌 Message Pinning**: Pin crucial messages to the top with a dedicated carousel banner allowing users to jump directly to any pinned message.
- **💬 Reply & Quotation Threading**: Reply to any message with an interactive quotation card that scrolls smoothly to the referenced source.
- **✏️ Rich Text Formatting**: In-line rich text editor supporting **Bold**, *Italic*, and <u>Underline</u> styles with live formatting shortcuts.
- **🟢 Active Presence & Live Typing**: Instant online/offline user detection and animated real-time typing indicators with automatic idle timeouts.
- **🔔 Unread Message Counter & Alerts**: Synchronized unread badge counts across sessions, with instant updates even when navigating different chats.
- **📱 100% Mobile & Desktop Responsive**: Mobile-first viewport optimization (`100dvh`), sticky header/input areas, bottom-anchored message flow, and WhatsApp-style date pill dividers.
- **🛡️ Secure Authentication**: Password hashing with Bcrypt, stateless JSON Web Tokens (JWT) stored safely in HTTP-only, secure cookies, and route guard middleware.
- **🖼️ Profile & Media Uploads**: Custom profile pictures with direct uploading and transformation via Cloudinary.
- **🌙 Dark & Light Modes**: Full theme compatibility across all components and conversation threads.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Core UI library |
| **[Vite](https://vitejs.dev/)** | High-performance build tool and local dev server |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern styling and CSS animations |
| **[Zustand](https://github.com/pmndrs/zustand)** | Centralized state management for Auth, Chat, and Sockets |
| **[Socket.IO Client](https://socket.io/)** | Client-side WebSocket connectivity |
| **[Motion](https://motion.dev/)** | Smooth UI micro-interactions and transitions |
| **[Lucide React](https://lucide.dev/)** | Icon suite |
| **[Axios](https://axios-http.com/)** | HTTP client configured with credentials |
| **[React Router DOM](https://reactrouter.com/)** | Declarative client-side routing |
| **[React Hot Toast](https://react-hot-toast.com/)** | Lightweight notification toasts |

### Backend

| Technology | Purpose |
| :--- | :--- |
| **[Node.js](https://nodejs.org/)** | Server JavaScript runtime environment |
| **[Express.js v5](https://expressjs.com/)** | RESTful routing and API framework |
| **[Socket.IO v4](https://socket.io/)** | Real-time WebSocket server engine with rooms |
| **[MongoDB](https://www.mongodb.com/)** & **[Mongoose v9](https://mongoosejs.com/)** | NoSQL database with document schemas and relations |
| **[JSON Web Tokens (JWT)](https://jwt.io/)** | Stateless session tokens |
| **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** | Salted password hashing |
| **[Cloudinary](https://cloudinary.com/)** & **[Multer](https://github.com/expressjs/multer)** | Image upload processing and cloud storage |
| **[Cookie-Parser](https://github.com/expressjs/cookie-parser)** | Secure cookie extraction |
| **[CORS](https://github.com/expressjs/cors)** | Cross-origin resource sharing middleware |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client (React 19 + Tailwind CSS)"]
        UI["Chat UI / Responsive Layout"]
        Zustand["Zustand Stores (Auth, Chat, Socket)"]
        Axios["Axios (REST API Client)"]
        SocketClient["Socket.IO Client"]
    end

    subgraph Server ["Backend (Node.js + Express 5)"]
        AuthMiddleware["JWT Auth Middleware"]
        Controllers["Controllers (Auth, Users, Messages, Groups)"]
        SocketServer["Socket.IO Server (Rooms & Handlers)"]
    end

    subgraph Storage ["Cloud Infrastructure"]
        MongoDB[("MongoDB Atlas Database")]
        Cloudinary["Cloudinary CDN (Media)"]
    end

    UI --> Zustand
    Zustand --> Axios
    Zustand --> SocketClient

    Axios -->|HTTP / Cookies| AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> MongoDB
    Controllers --> Cloudinary

    SocketClient <-->|WebSockets (Bi-directional)| SocketServer
    SocketServer <--> MongoDB
```

---

## 📁 Project Directory Structure

```text
mern_chat_pro/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   └── db.js                  # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── auth.controller.js     # User registration, login, logout, me
│   │   ├── group.controller.js    # Group chat creation and conversations
│   │   ├── message.controller.js  # Message sending, pin/unpin, read receipts
│   │   └── user.controller.js     # Sidebar users list, profile update
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── Conversation.js        # Conversation schema (1-on-1 & groups)
│   │   ├── Message.js             # Message schema (pins, replies, content)
│   │   └── User.js                # User schema (credentials, avatar)
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth endpoints
│   │   ├── group.routes.js        # /api/groups endpoints
│   │   ├── message.routes.js      # /api/messages endpoints
│   │   └── user.routes.js         # /api/users endpoints
│   ├── sockets/
│   │   └── socket.js              # Socket.IO connection & room orchestration
│   ├── utils/
│   │   └── generateToken.js       # JWT generation and cookie attachment
│   ├── .env.example               # Backend environment variables template
│   ├── package.json
│   └── server.js                  # Application entry point & server setup
│
├── frontend/
│   ├── public/                    # Favicon, wallpapers, and static assets
│   ├── src/
│   │   ├── assets/                # Local graphic assets
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatSidebar.jsx    # User/group conversation list & unread count
│   │   │   │   ├── ChatWindow.jsx     # Active message thread, input, date pills
│   │   │   │   ├── ContactInfo.jsx    # User profile side drawer & details
│   │   │   │   └── RightProfilePane.jsx
│   │   │   └── layout/
│   │   │       └── ChatLayout.jsx     # Master responsive container (100dvh)
│   │   ├── context/
│   │   │   ├── useAuthStore.js        # Auth state & checkAuth logic
│   │   │   ├── useChatStore.js        # Conversations, active messages, pins
│   │   │   └── useSocketStore.js      # Socket connection, presence, rooms
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Sign-in page
│   │   │   ├── Profile.jsx            # User profile and picture updates
│   │   │   └── Register.jsx           # Sign-up page
│   │   ├── App.jsx                    # Root routing and theme wrapper
│   │   ├── index.css                  # Global Tailwind styles & bubble styling
│   │   └── main.jsx                   # React DOM entry point
│   ├── .env.example                   # Frontend environment variables template
│   ├── package.json
│   └── vite.config.js                 # Vite configuration
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (`v18.x` or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A free [Cloudinary](https://cloudinary.com/) account (for avatar uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yashgoyal566/Chat-Application.git
cd Chat-Application
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```
4. Update the values in `.env` with your MongoDB URI, JWT secret, and Cloudinary keys (see [Environment Variables](#backend-env)).
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be live at `http://localhost:3001` (or your configured `PORT`).

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Set the `VITE_BACKEND_URL` in `.env` (defaults to `http://localhost:3001` for local development).
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173` in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server to listen on | `3001` |
| `MONGO_URI` | MongoDB connection connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/chat` |
| `JWT_SECRET` | Secret key used to sign and verify JWT cookies | `your_super_secret_jwt_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `CLIENT_URL` | Allowed frontend origin for CORS and cookies | `http://localhost:5173` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Base URL of the deployed or local backend server | `http://localhost:3001` |

---

## 📡 API Reference

All protected routes require an authenticated HTTP-only JWT cookie (`jwt`).

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log into an existing account | Public |
| `POST` | `/api/auth/logout` | Clear session cookie and log out | Public |
| `GET` | `/api/auth/me` | Retrieve the authenticated user's session profile | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/` | Get list of all users for sidebar conversations | Private |
| `PUT` | `/api/users/profile` | Update profile details and avatar picture | Private |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/:id` | Fetch all messages with a user or group | Private |
| `POST` | `/api/messages/send/:id` | Send a new message (text, rich HTML, replies) | Private |
| `PUT` | `/api/messages/:id/pin` | Toggle pin status for a message | Private |
| `PUT` | `/api/messages/read/:id` | Mark all incoming messages from a user as read | Private |

### Groups (`/api/groups`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups/conversations` | Retrieve all group conversations for user | Private |
| `POST` | `/api/groups/` | Create a new group chat with initial members | Private |

---

## 🔄 Socket.IO Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `setup` | Client $\rightarrow$ Server | `{ userId }` | Registers user's active socket into their personal user room |
| `get_online_users` | Server $\rightarrow$ Client | `string[]` | Emits array of all currently active user IDs |
| `typing` | Client $\rightarrow$ Server | `{ receiverId }` | Emits typing state to target recipient's room |
| `stop_typing` | Client $\rightarrow$ Server | `{ receiverId }` | Cancels typing status for target recipient |
| `receive_message` | Server $\rightarrow$ Client | `Message` object | Delivers newly sent message to recipient in real time |
| `disconnect` | Client $\rightarrow$ Server | - | Cleans up socket references and updates online presence |

---

## 🌐 Deployment

### Frontend (Appwrite Cloud / Vercel)
- **Appwrite Cloud**: Connect repository to Appwrite Sites/Web Apps, configure root directory to `frontend`, and set build command:
  ```bash
  npm run build
  ```
  with output directory `dist`.
- Set environment variable: `VITE_BACKEND_URL=https://chat-application-1-brgc.onrender.com`.

### Backend (Render / Railway)
- Deploy as a **Web Service** with root directory `backend`.
- Build Command: `npm install`
- Start Command: `npm start`
- Ensure all environment variables from `backend/.env.example` are configured in the host dashboard.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are very welcome!

1. **Fork** the repository.
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add AmazingFeature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed by <a href="https://github.com/yashgoyal566">Yash Goyal</a>. Star ⭐ the repository if you found it helpful!</sub>
</div>
