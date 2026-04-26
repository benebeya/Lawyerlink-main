# Lawyerlink - Full Stack Legal Platform

This project is a complete legal consultation platform built with **React** (Frontend) and **Node.js + SQLite** (Backend).

## 📁 Project Structure

```text
/
├── backend/            # Node.js Express server + SQLite database
│   ├── server.js       # Main server logic & API endpoints
│   └── database.sqlite # SQLite database file
├── src/                # React Frontend source
│   ├── components/     # Reusable UI components
│   ├── context/        # Auth and Global state
│   ├── lib/            # API wrappers (storage.js)
│   ├── pages/          # Grouped by role (auth, client, lawyer, home)
│   └── styles/         # Global styles
├── package.json        # Root scripts to run everything
└── .env                # Environment variables
```

## 🚀 How to Run

You can now start both the frontend and the backend with a single command!

### 1. Install Dependencies
Run this in the root directory:
```bash
npm install
cd backend && npm install
```

### 2. Start the Application
Run this in the root directory:
```bash
npm start
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5002

## ⚖️ Features
- **SQLite Persistence**: No more losing data on refresh.
- **Role-Based Access**: Separate dashboards for clients and legal agents.
- **Real-time Notifications**: Clients get notified when lawyers accept their requests.
- **Document Management**: Clients can upload evidence for consultation.

---
Projet de Fin de Module "Build & Ship" - 2026
