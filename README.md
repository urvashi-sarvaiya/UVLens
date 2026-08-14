# 🔍 UVLens

**AI-powered bill analyzer that turns confusing utility, mobile, and insurance bills into plain-language summaries.**

Upload a photo or PDF of any bill — UVLens extracts the text, breaks down every charge in simple terms, flags anything unusual, and tracks your spending trends over time.

🔗 **Live App:** [uvlens-frontend.onrender.com](https://uvlens-frontend.onrender.com)
🔗 **Backend API:** [uvlens-backend.onrender.com](https://uvlens-backend.onrender.com)

> **Note:** The backend runs on Render's free tier, so it may take ~50 seconds to spin up on the first request after inactivity.

---

## ✨ Features

- **📸 Flexible upload** — snap a photo on mobile or attach a PDF/image on desktop, all through one upload flow
- **🔍 OCR text extraction** — powered by Tesseract.js, with image preprocessing (grayscale, contrast, resizing) for better accuracy on noisy photos
- **🧠 AI-powered analysis** — Groq's Llama 3.3 70B parses the raw text into a structured breakdown: bill type, provider, billing period, due date, and every line item explained in plain language
- **⚠️ Anomaly flagging** — automatically highlights unusual or unexplained charges
- **🧾 Bill history** — every analyzed bill is saved and browsable, with full detail view and delete support
- **📊 Trends dashboard** — visualize spending over time and by category using interactive charts
- **🌗 Dark / light mode** — theme preference saved across sessions
- **📱 Fully responsive** — works cleanly on both desktop and mobile browsers

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- React Router
- Axios
- Recharts (data visualization)
- Plain CSS with a custom pastel design system

**Backend**
- Node.js + Express
- MongoDB Atlas (Mongoose)
- Tesseract.js (OCR)
- Sharp (image preprocessing)
- pdf-parse (PDF text extraction)
- Groq API (Llama 3.3 70B) for bill analysis

**Deployment**
- Frontend & backend both hosted on Render

---

## 📂 Project Structure

```
UVLens/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios API layer
│       ├── components/     # Navbar, UploadArea, ResultsView, LoadingState
│       ├── context/        # Theme context (dark/light mode)
│       ├── pages/          # UploadPage, History, Dashboard, BillDetail
│       └── styles/         # CSS variables & design system
│
└── server/                 # Node/Express backend
    ├── controllers/        # Request handlers
    ├── middleware/         # Multer upload config
    ├── models/             # Mongoose schemas
    ├── routes/              # API routes
    └── services/            # OCR service, Groq analysis service
```

---

## ⚙️ How It Works

1. User uploads a bill (image or PDF) via the frontend
2. Backend receives the file through a Multer-handled endpoint
3. **Images** are preprocessed with Sharp, then passed through Tesseract.js OCR
   **PDFs** are parsed directly with pdf-parse for text extraction
4. The extracted raw text is sent to Groq's Llama 3.3 70B with a structured prompt, returning strict JSON: bill type, provider, line items with plain-language explanations, anomaly flags, and a summary
5. The analyzed bill is saved to MongoDB and returned to the frontend for display
6. Past bills are browsable via the History page and visualized in the Dashboard

---

## 🚀 Running Locally

**Backend**
```bash
cd server
npm install
# create a .env file with MONGO_URI and GROQ_API_KEY
node server.js
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Create a `.env` in `client/` with:
```
VITE_API_BASE_URL=http://localhost:5000/api/bills
```

---


## 👤 Author

**Urvashi Sarvaiya**
B.E. Information Technology, Government Engineering College, Bhavnagar