# 🏥 Medical Insurance Cost Predictor

A full-stack ML-powered web application that estimates annual medical insurance premiums based on personal health and demographic inputs. Built with a **FastAPI** backend serving a trained machine learning model and a **React** frontend with a modern, multi-step UI.

---

## 📸 Preview

> A 3-step wizard UI that collects user info, displays a live BMI health badge, and returns a predicted insurance cost — styled with a dark glassmorphic theme.

---

## 🚀 Features

- 🔮 **ML-Powered Predictions** — Uses a pre-trained model (`trained_model.sav`) via scikit-learn/joblib
- 🧭 **3-Step Wizard UI** — Guided form across Personal Info → Health Details → Location & Review
- 📊 **Live BMI Badge** — Real-time BMI classification (Underweight / Normal / Overweight / Obese)
- ⚠️ **Smoker Warning** — Highlights premium impact for smokers
- 📋 **Profile Summary** — Review all inputs before submitting
- 🌐 **CORS-Enabled API** — Ready for local and cross-origin frontend connections
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
├── backend/
│   ├── app.py                  # FastAPI app with /predict endpoint
│   └── trained_model.sav       # Pre-trained ML model (joblib)
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main React component (3-step wizard)
    │   ├── App.css             # Base styles
    │   ├── index.css           # Global CSS variables & typography
    │   └── main.jsx            # React entry point
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

---

### 🐍 Backend (FastAPI)

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate        # macOS/Linux
   venv\Scripts\activate           # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn numpy joblib scikit-learn pydantic
   ```

4. **Make sure `trained_model.sav` is in the same directory as `app.py`.**

5. **Run the API server:**
   ```bash
   uvicorn app:app --reload
   ```

6. **Verify it's running:**
   Open [http://127.0.0.1:8000](http://127.0.0.1:8000) — you should see:
   ```json
   { "message": "API is running 🚀" }
   ```

> 📖 Interactive API docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### ⚛️ Frontend (React + Vite)

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install axios (if not already listed):**
   ```bash
   npm install axios
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

> ⚠️ Make sure the backend is running **before** using the frontend, as it calls `http://127.0.0.1:8000/predict`.

---

## 🔌 API Reference

### `GET /`
Health check endpoint.

**Response:**
```json
{ "message": "API is running 🚀" }
```

---

### `POST /predict`
Returns a predicted insurance cost based on input features.

**Request Body:**
```json
{
  "age": 30,
  "sex": "male",
  "bmi": 24.5,
  "children": 1,
  "smoker": "no",
  "region": "southeast"
}
```

| Field      | Type    | Values                                          |
|------------|---------|--------------------------------------------------|
| `age`      | integer | 18 – 80                                          |
| `sex`      | string  | `"male"` / `"female"`                           |
| `bmi`      | float   | e.g. `22.5`                                      |
| `children` | integer | 0 – 5                                            |
| `smoker`   | string  | `"yes"` / `"no"`                                |
| `region`   | string  | `"southeast"` / `"southwest"` / `"northeast"` / `"northwest"` |

**Success Response:**
```json
{
  "success": true,
  "predicted_insurance_cost": 12345.67
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid region"
}
```

---

## 🧠 Model Details

| Property        | Detail                        |
|----------------|-------------------------------|
| Format          | `.sav` (joblib serialized)    |
| Framework       | scikit-learn                  |
| Input Features  | age, sex, bmi, children, smoker, region |
| Output          | Predicted annual insurance cost (float) |

**Encoding used during training:**

| Feature  | Encoding                                  |
|----------|-------------------------------------------|
| sex      | male → 0, female → 1                     |
| smoker   | yes → 0, no → 1                          |
| region   | southeast→0, southwest→1, northeast→2, northwest→3 |

---

## 🛠️ Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React, Vite, Axios       |
| Backend   | FastAPI, Uvicorn         |
| ML        | scikit-learn, joblib, NumPy |
| Styling   | CSS (custom, no UI library) |

---

## 🔒 Production Notes

- Replace `allow_origins=["*"]` in `app.py` with your frontend's actual domain before deploying.
- Store the model file securely and avoid committing it to public repositories if it contains sensitive training data.
- Consider adding input validation and rate limiting to the API for public deployments.

---

## 📄 License

This project is for educational purposes. Feel free to fork and build upon it.
