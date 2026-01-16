from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ProjectRequirements, RecommendationResponse
from .engine import generate_recommendation

app = FastAPI(title="StackSense API", version="1.0.0")

# Setup CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to StackSense API"}

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendation(requirements: ProjectRequirements):
    try:
        recommendation = generate_recommendation(requirements)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
