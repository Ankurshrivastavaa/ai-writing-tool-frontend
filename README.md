# ✨ AI Writing Tool — Full Stack SaaS Application

> **Generate professional content in seconds using AI** — LinkedIn posts, cold emails, blog introductions, tweet threads, and product descriptions powered by Groq LLaMA 3.3.

<div align="center">

![AI Writing Tool Banner](https://via.placeholder.com/800x200/6366f1/ffffff?text=AI+Writing+Tool)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-6366f1?style=for-the-badge)](https://ai-writing-tool-frontend.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Railway-purple?style=for-the-badge&logo=railway)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🚀 About the Project

**AI Writing Tool** is a production-ready, full-stack SaaS application that helps content creators, marketers, and professionals generate high-quality written content instantly using AI.

Users sign up, get **10 free credits**, and can generate different types of professional content by simply entering a topic. Each generation costs 1 credit, encouraging a freemium-style usage model.

### 🎯 Problem It Solves
Writing professional content consistently takes time and energy. This tool removes that friction — enter a topic, choose your content type, and get polished, ready-to-use content in seconds.

---

## ✨ Features

- 🤖 **AI Content Generation** — Powered by Groq LLaMA 3.3 70B model
- 📝 **5 Content Types** — LinkedIn posts, cold emails, blog intros, tweet threads, product descriptions
- 🔐 **Secure Authentication** — JWT-based login and signup with bcrypt password hashing
- 💳 **Credit System** — 10 free credits on signup, tracks usage per user
- 💾 **Save Content** — Save generated content to your personal library
- 📋 **Copy to Clipboard** — One-click copy for instant use
- ⬇️ **Download** — Export content as a text file
- 🔁 **Regenerate** — Not happy? Regenerate with one click
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI Framework |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Railway | Deployment |

### Database & AI
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Groq AI API | LLM Provider |
| LLaMA 3.3 70B | AI Model |

---

## 📸 Screenshots

> Add screenshots of your app here after taking them!

| Login Page | Dashboard | Generated Content |
|---|---|---|
| ![Login](https://via.placeholder.com/250x160/6366f1/fff?text=Login+Page) | ![Dashboard](https://via.placeholder.com/250x160/8b5cf6/fff?text=Dashboard) | ![Output](https://via.placeholder.com/250x160/10b981/fff?text=Generated+Content) |

---

## ⚡ Getting Started

### Prerequisites

Make sure you have these installed:

```bash
node -v    # v16 or higher
npm -v     # v8 or higher
```

### Clone the Repository

```bash
git clone https://github.com/Ankurshrivastavaa/ai-writing-tool-frontend.git
cd ai-writing-tool
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your credentials (see Environment Variables section)

# Start development server
npm run dev
```

Server runs at: `http://localhost:5000`

Test it: `http://localhost:5000/api/health` → `{"status":"Server is running"}`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start development server
npm start
```

App opens at: `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-writer?appName=ai
GROQ_API_KEY=gsk_your_groq_api_key_here
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

### Where to Get Keys

| Key | Link |
|---|---|
| `MONGODB_URI` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Free tier |
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com/keys) — Free |
| `JWT_SECRET` | Any random strong string |

---

## 📁 Project Structure

```
ai-writing-tool/
│
├── 📁 backend/
│   ├── server.js          # Main server — Express, routes, middleware
│   ├── .env               # Secret keys (never commit this)
│   ├── .env.example       # Template for env variables
│   ├── .gitignore
│   └── package.json
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── index.html     # Tailwind CDN added here
│   ├── 📁 src/
│   │   ├── App.jsx        # Main React component (entire app)
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Frontend environment variables
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Base URL
```
Local:      http://localhost:5000
Production: https://ai-writing-tool-backend-production.up.railway.app
```

### Authentication

**Sign Up**
```http
POST /api/auth/signup

Body:
{
  "email": "user@example.com",
  "password": "yourpassword"
}

Response:
{
  "token": "jwt_token_here",
  "credits": 10,
  "message": "Account created successfully"
}
```

**Login**
```http
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "yourpassword"
}

Response:
{
  "token": "jwt_token_here",
  "credits": 10,
  "plan": "free"
}
```

### Content Generation

**Generate Content** *(requires auth)*
```http
POST /api/generate
Authorization: Bearer <token>

Body:
{
  "contentType": "linkedin",   // linkedin | email | blog | tweet | description
  "topic": "Tips for learning React"
}

Response:
{
  "content": "Generated content here...",
  "creditsRemaining": 9
}
```

### Saved Content

**Save Content** *(requires auth)*
```http
POST /api/save
Authorization: Bearer <token>

Body:
{
  "contentType": "linkedin",
  "topic": "Tips for learning React",
  "content": "Generated content here..."
}
```

**Get Saved Content** *(requires auth)*
```http
GET /api/saved
Authorization: Bearer <token>
```

**Delete Saved Content** *(requires auth)*
```http
DELETE /api/saved/:id
Authorization: Bearer <token>
```

**Health Check**
```http
GET /api/health

Response: { "status": "Server is running" }
```

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Push to GitHub
git add .
git commit -m "Deploy frontend"
git push

# Then on Vercel:
# 1. Import GitHub repo
# 2. Add environment variable:
#    REACT_APP_API_URL = https://your-railway-url.up.railway.app
# 3. Deploy
```

### Backend → Railway

```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push

# Then on Railway:
# 1. Create new project from GitHub
# 2. Add all environment variables
# 3. Generate domain in Settings → Networking
```

### Database → MongoDB Atlas (Free)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Allow access from anywhere (Network Access → 0.0.0.0/0)
4. Get connection string and add to `.env`

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcryptjs** (10 salt rounds)
- ✅ **JWT tokens** with 30-day expiry
- ✅ **CORS** configured for specific origins only
- ✅ **Environment variables** for all secrets
- ✅ Input validation on all API endpoints
- ✅ `.gitignore` prevents committing `.env` files
- ✅ HTTP-only headers on production

---

## 🧪 Testing the App

1. Visit [https://ai-writing-tool-frontend.vercel.app](https://ai-writing-tool-frontend.vercel.app)
2. Click **"Create Account"**
3. Enter any email and password (min 6 chars)
4. You get **10 free credits**
5. Select content type (e.g., LinkedIn Post)
6. Enter a topic (e.g., "Tips for learning React")
7. Click **"Generate Content ✨"**
8. Copy, download, or save your content!

---

## 🗺️ Roadmap

- [ ] Stripe payment integration for credit top-up
- [ ] Email notifications on signup
- [ ] More content types (Instagram captions, YouTube descriptions)
- [ ] Tone/style selector (formal, casual, funny)
- [ ] Content history with search and filter
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Usage analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ankur Shrivastava**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/ankur-shrivastava-65184724b/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Ankurshrivastavaa)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat&logo=gmail)](mailto:ankurshrivastava0077@gmail.com)

---

## ⭐ Show Your Support

If this project helped you, please give it a **⭐ star** on GitHub — it means a lot!

---

<div align="center">
  <strong>Built with ❤️ by Ankur Shrivastava</strong><br/>
  <a href="https://ai-writing-tool-frontend.vercel.app">🌐 Live Demo</a> •
  <a href="https://github.com/Ankurshrivastavaa/ai-writing-tool-frontend">💻 Frontend Repo</a> •
  <a href="https://github.com/Ankurshrivastavaa/ai-writing-tool-backend">⚙️ Backend Repo</a>
</div>
