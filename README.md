# ⚖️ LawyerLink - Full Stack Legal Platform

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tech](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)
![Tech](https://img.shields.io/badge/Supabase-Database-orange?style=for-the-badge&logo=supabase)
![Tech](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**LawyerLink** is a modern, full-stack ecosystem designed to bridge the gap between clients and legal professionals. Built with a focus on speed, security, and user experience, it provides a seamless workflow for legal consultations, case management, and document handling.

---

## ✨ Key Features

### 🏢 For Clients
- **Lawyer Discovery**: Browse through a curated list of legal professionals, filtered by specialty, experience, and price.
- **Secure Requests**: Submit consultation requests with detailed descriptions and categorize them (Family, Criminal, Corporate, etc.).
- **Evidence Management**: Securely upload and store legal documents and evidence directly to Supabase Storage.
- **Instant Tracking**: Stay informed with real-time notifications when a lawyer accepts or updates your request.

### 👨‍⚖️ For Lawyers
- **Professional Dashboard**: Manage all incoming consultation requests from a single interface.
- **Request Lifecycle**: Accept or decline cases, and schedule appointments with a clean calendar-based workflow.
- **Profile Customization**: Showcase your expertise, office location, and consultation rates to attract the right clients.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Storage** | Supabase Buckets (for document/evidence storage) |
| **State/Auth** | React Context API & Supabase Auth |

---

## 📁 Project Structure

```text
LawyerLink/
├── backend/            # Express.js Server
│   ├── server.js       # API endpoints & Database initialization
│   └── .env            # Backend configuration
├── src/                # React Frontend
│   ├── components/     # UI Building blocks (Modals, Cards, Nav)
│   ├── context/        # Auth & Global State
│   ├── lib/            # Supabase client & Storage utilities
│   ├── pages/          # Dashboard layouts (Client vs Lawyer)
│   └── styles/         # Tailwind & Global CSS
├── public/             # Static assets
└── package.json        # Unified scripts (Frontend + Backend)
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally in minutes.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Supabase** project (for PostgreSQL and Storage)

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-username/Lawyerlink.git
cd Lawyerlink

# Install root dependencies (includes concurrently)
npm install

# Install backend dependencies
cd backend && npm install
cd ..
```

### 3. Environment Variables
You need to set up two `.env` files.

#### Root Directory (`.env`)
Create a `.env` in the root for the React frontend:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5002/api
```

#### Backend Directory (`backend/.env`)
Create a `.env` inside the `backend` folder:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=5002
```

### 4. Run the Application
One command to rule them all:
```bash
npm start
```
This will start:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5002](http://localhost:5002)

---

## 🔒 Security & Performance
- **Connection Pooling**: Uses Supabase connection pooling for efficient database operations.
- **Row Level Security (RLS)**: Enforced via Supabase to ensure clients only see their own data.
- **Fast Build**: Powered by Vite for near-instant HMR (Hot Module Replacement).

---

## 📜 License
Projet de Fin de Module "Build & Ship" - 2026.

---

> [!TIP]
> Make sure to create a bucket named `documents` in your Supabase Storage settings and set it to **public** (or configure appropriate RLS policies) for the file upload feature to work.
