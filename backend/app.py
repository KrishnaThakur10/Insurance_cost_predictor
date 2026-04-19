from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Medical Insurance Cost Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace with specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("trained_model.sav")


# Input Schema (same as frontend)
class InsuranceInput(BaseModel):
    age: int
    sex: str          # male / female
    bmi: float
    children: int
    smoker: str       # yes / no
    region: str       # southeast / southwest / northeast / northwest


# Encoding function (MATCHES YOUR TRAINING)
def encode_input(data: InsuranceInput):

    # SEX (male=0, female=1)
    if data.sex.lower() == "male":
        sex = 0
    elif data.sex.lower() == "female":
        sex = 1
    else:
        raise ValueError("Invalid sex")

    # SMOKER (yes=0, no=1)
    if data.smoker.lower() == "yes":
        smoker = 0
    elif data.smoker.lower() == "no":
        smoker = 1
    else:
        raise ValueError("Invalid smoker value")

    # REGION
    region_map = {
        "southeast": 0,
        "southwest": 1,
        "northeast": 2,
        "northwest": 3
    }

    region = region_map.get(data.region.lower())
    if region is None:
        raise ValueError("Invalid region")

    return np.array([[data.age, sex, data.bmi, data.children, smoker, region]])


@app.get("/")
def home():
    return {"message": "API is running 🚀"}


@app.post("/predict")
def predict(data: InsuranceInput):
    try:
        input_data = encode_input(data)
        prediction = model.predict(input_data)

        return {
            "success": True,
            "predicted_insurance_cost": round(float(prediction[0]), 2)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }