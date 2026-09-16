# AI Interviewer

An AI-powered mock interview platform built with the MERN stack and Google Gemini AI. The application generates personalized interview questions based on the candidate's role, experience, difficulty, and interview type, then evaluates answers using AI and provides scores, feedback, strengths, and improvement areas.

---

##  Live Demo

https://ai-interviewers-beta.vercel.app

---
##  Overview

AI Interviewer helps candidates practice realistic technical, HR, behavioral, and mixed interviews through an interactive AI-powered experience.

The platform dynamically generates interview questions and evaluates candidate responses using Google Gemini AI. Each interview is stored securely so candidates can review their previous interviews and performance.

---
##  Features

- 🔐 Secure user authentication with JWT
- 👤 User registration and login
- 🧠 AI-generated interview questions using Google Gemini
- 🎯 Personalized interviews based on:
  - Job Role
  - Experience Level
  - Difficulty
  - Interview Type
  - Number of Questions
- 💻 Technical interviews for development roles
- 🎤 Speech recognition for answering questions
- 🔊 Text-to-speech for AI-generated questions
- 🤖 AI-powered answer evaluation
- 📊 Individual question scoring
- 📝 AI-generated feedback
- 💪 Strengths identification
- 📈 Areas for improvement
- 🏆 Overall interview score
- 📚 Interview history
- 📋 Detailed result analysis
- 🔒 Protected routes with JWT authentication
- 📱 Responsive user interface
- ☁️ Production deployment with Vercel and Render

---

##  Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS
- Web Speech API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS

### AI

- Google Gemini API
- `@google/genai`

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
---

##  Project Architecture

```text
AI-Interviewer/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── interviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Interview.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── interviewRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```
---

# Application Flow
```
User Registration / Login
          ↓
      Dashboard
          ↓
    Start Interview
          ↓
Select Role / Experience / Difficulty
          ↓
      Gemini AI
          ↓
Generate Interview Questions
          ↓
   Interactive Interview
          ↓
Candidate Answers Question
          ↓
      Gemini AI
          ↓
Answer Evaluation
          ↓
Score + Feedback + Strengths
          ↓
      Final Result
          ↓
    Interview History
```
---

# AI Interview Generation

The application uses Google Gemini AI to generate interview questions according to the candidate's selected configuration.

Example:

- Role: Full Stack Developer
- Experience: Fresher
- Difficulty: Medium
- Interview Type: Mixed
- Questions: 10

The AI generates relevant questions covering practical development concepts such as:

- JavaScript
- React
- Node.js
- Express.js
- MongoDB
- REST APIs
- Authentication
- Debugging
- Problem Solving
- System Design Basics
# AI Answer Evaluation

Each candidate answer is evaluated using multiple criteria:

- Technical correctness
- Conceptual understanding
- Relevance
- Clarity
- Completeness
- Practical knowledge
- Communication quality

The system returns:

Score: 0–10
```
Feedback
Strengths
Areas for Improvement
```
The application also calculates the candidate's overall interview score based on evaluated answers.

---
# 🔐 Authentication

Authentication is implemented using:

- JWT
- bcryptjs
- Protected API routes
- Axios authentication interceptor
- Token-based session management

Protected resources can only be accessed by authenticated users.

---

# API Endpoints
### Authentication
```
POST /api/auth/register
POST /api/auth/login
```
### Interviews
```
POST /api/interviews
GET  /api/interviews
GET  /api/interviews/:id

POST /api/interviews/:id/questions/:questionIndex/review
```
All interview endpoints require JWT authentication.

---

# Installation
### 1. Clone the repository
```
git clone https://github.com/ambikejaiswal/AI-Interviewer.git
cd AI-Interviewer
```
### 2. Backend Setup
```
cd backend
npm install
```
Create a .env file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend:
```
npm run dev
```
Backend runs on:
```
http://localhost:5000
```
### 3. Frontend Setup

Open another terminal:
```
cd frontend
npm install
```
Start the frontend:
```
npm run dev
```
Frontend runs on:
```
http://localhost:5173
```
---

# Interview Result

After completing an interview, candidates can view:

- Overall Score
- Interview Details
- Question-wise Answers
- Individual Scores
- AI Feedback
- Strengths
- Areas for Improvement
- Interview Status

This allows candidates to identify weak areas and improve their interview performance.

---
## Author

Ambike Jaiswal

B.Tech Computer Science & Engineering

GitHub: htttps://www.github.com/ambikejaiswal

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
