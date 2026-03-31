# 🏥 Smart Diagnosis AI

> AI-powered symptom analysis tool that helps users identify potential health conditions based on their symptoms. Get instant, structured medical insights powered by advanced AI.

---

## 🛠️ Tech Stack

| **Category** | **Technology** | **Badge** |
|:---:|:---:|:---:|
| **Backend** | Node.js | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) |
| **Backend Framework** | Express.js | ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) |
| **Frontend** | React | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) |
| **Frontend Builder** | Vite | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) |
| **Styling** | Tailwind CSS | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **AI/ML** | Groq API | ![Groq](https://img.shields.io/badge/Groq_API-000000?style=flat&logoColor=white) |
| **Database** | MongoDB | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) |
| **ODM** | Mongoose | ![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=flat&logoColor=white) |
| **HTTP Client** | Axios | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) |
| **Icons** | React Icons | ![React Icons](https://img.shields.io/badge/React_Icons-44D62C?style=flat&logoColor=white) |

---

## 📋 Overview

**Smart Diagnosis AI** is a full-stack web application that leverages cutting-edge AI (Groq API) to provide intelligent symptom analysis. Users describe their symptoms, and the AI engine—trained on medical knowledge—returns probable conditions with actionable next steps.

### 🎯 Problems It Solves

- **Instant Health Insights**: No waiting for doctor appointments for urgent symptom checks
- **Medical Accessibility**: Bridges the gap for users in remote areas with limited healthcare resources
- **Smart Symptom Understanding**: Autocorrects typos and fuzzy matches to recognize medical terminology
- **Persistent History**: Keeps track of all diagnosis queries for future reference
- **Out-of-Context Detection**: Filters nonsense input and guides users to ask health-related questions only

### ✨ Key Features

✅ **AI-Powered Diagnosis** – Groq API returns structured diagnosis (2-3 conditions, probabilities, next steps)  
✅ **Symptom Autocorrect** – Levenshtein distance matching + word-level fallback for typo tolerance  
✅ **History Management** – Full CRUD (Create, Read, Delete) diagnosis history in MongoDB  
✅ **Responsive Design** – Mobile-first Tailwind CSS UI with bright, modern theme  
✅ **Input Validation** – Smart detection of nonsense/out-of-context queries  
✅ **Clean Architecture** – MVC pattern with separated concerns (models, controllers, services, routes)  
✅ **Production Ready** – Health check endpoint, error handling, deployable to Render

---

## 🏗️ Architecture

```
Smart Diagnosis API
│
├── 📁 Backend (Node.js + Express)
│   ├── server.js                 # Entry point, MongoDB connection
│   ├── app.js                    # Express app setup, middleware, routes
│   ├── 📁 config/
│   │   └── db.js                 # MongoDB connection factory
│   ├── 📁 models/
│   │   └── Diagnosis.js          # Mongoose schema (symptoms, result, createdAt)
│   ├── 📁 controllers/
│   │   └── diagnosisController.js # Business logic (POST diagnose, GET history, DELETE record)
│   ├── 📁 routes/
│   │   └── diagnosisRoutes.js    # Route definitions
│   └── 📁 services/
│       └── groqService.js        # Groq API integration + prompt engineering
│
└── 📁 Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── App.jsx               # Main UI (navbar, form, results, history)
    │   ├── index.css             # Global styles and Tailwind config
    │   └── main.jsx              # React entry point
    └── package.json              # Dependencies (react, axios, react-icons)

Database: MongoDB Atlas
│
└── Collection: diagnoses
    ├── _id (ObjectId)
    ├── symptoms (String)
    ├── result (Object) { diagnosis: [{condition, probability, next_steps}] }
    └── createdAt (Date)
```

### Data Flow

```
User Input (Symptoms)
         ↓
   Frontend (React)
         ↓
   API Call (Axios) → POST /diagnose
         ↓
   Backend (Express)
         ↓
   Validation + Autocorrect
         ↓
   Groq API Service
         ↓
   AI Response (JSON parsed)
         ↓
   Save to MongoDB
         ↓
   Return Diagnosis
         ↓
   Display in UI + Add to History
```

---

## 🚀 Getting Started

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js** (v16+) and **npm**
- **MongoDB Atlas account** (free tier available at [mongodb.com](https://mongodb.com))
- **Groq API key** (free at [console.groq.com](https://console.groq.com))

### ⚡ Quick Setup (5 minutes)

#### 1️⃣ Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2️⃣ Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
DATABASE_URL=mongodb://user:password@host:27017/smart-diagnosis?ssl=true&authSource=admin
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

#### 3️⃣ Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

#### 4️⃣ Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v8.0.3  ready in 456 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 5️⃣ Test the Application

- Open browser: **http://localhost:5173/**
- Enter symptoms (e.g., "fever, cough, headache")
- Click **Diagnose** and see AI results
- View diagnosis history and delete records as needed

---

## 📡 API Reference

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 🏥 Health Check
```http
GET /health
```
**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

#### 🔍 Get Diagnosis
```http
POST /diagnose
Content-Type: application/json

{
  "symptoms": "fever, cough, chest pain"
}
```

**Response (200 OK):**
```json
{
  "diagnosis": [
    {
      "condition": "Flu (Influenza)",
      "probability": "65%",
      "next_steps": "Rest, stay hydrated, monitor temperature. Consult doctor if symptoms persist beyond 3 days."
    },
    {
      "condition": "Common Cold",
      "probability": "45%",
      "next_steps": "Get adequate rest, drink warm fluids, use throat lozenges."
    },
    {
      "condition": "Bronchitis",
      "probability": "40%",
      "next_steps": "Avoid irritants, use humidifier, take cough suppressants. Seek medical attention if worsens."
    }
  ]
}
```

**Error (400 Bad Request):**
```json
{
  "message": "⚠️ Please ask questions related to symptoms or health conditions."
}
```

---

#### 📜 Get Diagnosis History
```http
GET /history
```

**Response (200 OK):**
```json
{
  "history": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "symptoms": "fever, cough",
      "result": {
        "diagnosis": [...]
      },
      "createdAt": "2026-03-31T10:30:00.000Z"
    }
  ]
}
```

---

#### 🗑️ Delete Diagnosis Record
```http
DELETE /history/{recordId}
```

**Response (200 OK):**
```json
{
  "message": "Diagnosis deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Diagnosis not found"
}
```

---

## 🧠 How AI Works

### Prompt Engineering

The backend sends a **strict, structured prompt** to Groq that enforces:

✅ **Exactly 2-3 medical conditions** (no more, no less)  
✅ **JSON-only output** (no markdown, plain text, or explanations)  
✅ **Fixed response format** with condition, probability, and next_steps  
✅ **Validation fallback** if JSON is embedded in text  

**Example Prompt:**
```
You are a medical AI assistant. Based on the symptoms provided, 
suggest exactly 2-3 most likely conditions with probabilities and next steps.

Symptoms: fever, cough, chest pain

Return ONLY valid JSON. No markdown, no explanations:
{
  "diagnosis": [
    {"condition": "...", "probability": "...%", "next_steps": "..."},
    ...
  ]
}
```

### Output Validation

Each response is validated **before returning** to ensure:
- `diagnosis` array exists
- Array has exactly 2-3 items
- Each item has `condition`, `probability`, `next_steps` fields
- Probability includes `%` symbol

If validation fails → API returns error instead of broken data.

See `backend/services/groqService.js` for implementation details.

---

## 🎨 Frontend Features

### Smart Symptom Autocorrect

- **Levenshtein Distance Matching**: Catches typos (e.g., "fver" → "fever")
- **Word-Level Fallback**: Handles multi-word symptoms (e.g., "chst pin" → "chest pain")
- **80+ Symptom Dictionary**: Recognizes common medical terms
- **Real-Time Feedback**: Shows autocorrect suggestions as you type

### Input Validation

- **Nonsense Detection**: Rejects out-of-context queries (e.g., "what's the weather?")
- **Helpful Guidance**: Prompts users with examples of valid symptom input
- **20% Keyword Matching Threshold**: At least 1-in-5 words must be medical-related

### Responsive Design

- **Mobile-First**: Works seamlessly on phones, tablets, and desktops
- **Bright Shaded Theme**: Light blue gradient with sky/cyan accents (not dark)
- **Accessibility**: Clear typography, high contrast, easy-to-read cards

### History Management

- **Create**: Each diagnosis is automatically saved
- **Read**: View all past diagnoses sorted by date (newest first)
- **Delete**: Remove individual records with one click
- **Optimistic UI**: Instant visual feedback on delete (before server confirms)

---

## 📦 Building for Production

### Backend Build

```bash
cd backend
npm start
```

The start script runs `node server.js` with production readiness:
- Uses `process.env.PORT` (set on hosting platform)
- Connects to production MongoDB URI
- Health endpoint available at `GET /health`

### Frontend Build

```bash
cd frontend
npm run build
```

Output:
```
✓ 71 modules transformed.
dist/index.html                    0.45 kB │ gzip:  0.29 kB
dist/assets/index-CDX2Rlzw.css    11.32 kB │ gzip:  3.16 kB
dist/assets/index-CDX2Rlzw.js     237.74 kB │ gzip: 78.10 kB
✓ built in 481ms
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages)

---

## 🚢 Deployment Guide

### Option 1: Deploy Backend to Render

1. **Create Render account** at [render.com](https://render.com)
2. **Connect GitHub repo** to Render
3. **Create New Web Service**
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Set Environment Variables** in Render dashboard:
   ```
   PORT=5000
   DATABASE_URL=your_mongodb_uri
   GROQ_API_KEY=your_groq_key
   GROQ_MODEL=openai/gpt-oss-20b
   ```
5. **Deploy** and Render will automatically pull from GitHub

### Option 2: Deploy Frontend to Vercel

1. **Create Vercel account** at [vercel.com](https://vercel.com)
2. **Connect GitHub repo** to Vercel
3. **Set Project Root**: `frontend`
4. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
   ```
6. **Deploy** and Vercel will auto-redeploy on pushes

---

## 🐛 Troubleshooting

### MongoDB Connection Fails

**Error**: `querySrv ECONNREFUSED _mongodb._tcp.cluster.mongodb.net`

**Solution**: Use standard `mongodb://` URI instead of `mongodb+srv://`:
```env
DATABASE_URL=mongodb://user:password@host1:27017,host2:27017/smart-diagnosis?ssl=true&authSource=admin&replicaSet=name
```

### Groq API Errors

**Error**: `401 Unauthorized` or `403 Forbidden`

**Solution**: Verify your API key at [console.groq.com](https://console.groq.com) and update `.env`:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

### Frontend Won't Start

**Error**: `npm ERR! missing script: "dev"`

**Solution**: Ensure `package.json` includes Vite:
```bash
cd frontend
npm install vite --save-dev
```

### CORS Issues

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Backend `app.js` includes CORS middleware. Verify:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 📝 Project Structure

```
Smart-Diagnosis-API/
├── backend/
│   ├── node_modules/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   └── Diagnosis.js           # Mongoose schema
│   ├── controllers/
│   │   └── diagnosisController.js # Business logic
│   ├── routes/
│   │   └── diagnosisRoutes.js     # Express routes
│   ├── services/
│   │   └── groqService.js         # Groq API service
│   ├── app.js                     # Express app
│   ├── server.js                  # Entry point
│   ├── package.json
│   ├── .env                       # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                # Main React component
│   │   ├── index.css              # Global styles
│   │   ├── main.jsx               # React entry
│   │   └── App.module.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                       # Environment variables
│   └── .gitignore
│
├── README.md
├── .gitignore
└── .env.example                   # Example env file
```

---

## 📚 Key Technologies Explained

| Tech | Purpose |
|:---|:---|
| **Groq API** | Ultra-fast LLM inference (5000+ tokens/sec). Used for AI diagnosis generation. |
| **MongoDB** | NoSQL database storing diagnosis history with flexible schema. |
| **Mongoose** | ODM (Object Data Modeling) for MongoDB with schema validation. |
| **Express** | Lightweight Node.js web framework for REST API. |
| **React** | UI library for building interactive, responsive web interfaces. |
| **Tailwind CSS** | Utility-first CSS framework for rapid, responsive design. |
| **Vite** | Lightning-fast build tool and dev server for modern frontend development. |
| **Axios** | Promise-based HTTP client for frontend API calls. |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

**This is a demo application for educational purposes only.** It is **NOT a substitute for professional medical advice.** Always consult a qualified healthcare professional for medical concerns.

The AI diagnoses are based on common symptom patterns and should not be used for:
- Critical medical emergencies (call 911 or your local emergency number)
- Prescription drug recommendations
- Definitive medical diagnosis
- Replacing professional medical consultation

---



## 👤 Author

Created by **Mohd. Altamash Rizwi**

---

## 🔗 Links

- **Groq API Docs**: https://console.groq.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **React Docs**: https://react.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Express Docs**: https://expressjs.com

---

## ❓ FAQ

**Q: Can I use this app without a Groq API key?**  
A: No, the Groq API is required for AI diagnosis generation. Get a free key at https://console.groq.com

**Q: Is my medical data private?**  
A: All data is stored in your own MongoDB instance. Keep your DATABASE_URL secure.

**Q: Can I modify the AI prompt?**  
A: Yes! Edit the prompt in `backend/services/groqService.js` function `buildPrompt()`.

**Q: How many diagnosis records can I store?**  
A: MongoDB Atlas free tier allows up to 512 MB storage (~100k diagnosis records).

**Q: Can I deploy this myself?**  
A: Yes! Deploy backend to Render, Heroku, Railway, etc. Deploy frontend to Vercel, Netlify, GitHub Pages, etc.

---


