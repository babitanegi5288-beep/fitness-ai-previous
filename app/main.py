from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routers.auth import router as auth_router
from app.routers.training import router as training_router
from app.routers.nutrition import router as nutrition_router
from app.routers.food_scanner import router as food_scanner_router
from app.routers.ai_coach import router as ai_coach_router


app = FastAPI(title="FitAI Backend")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fitness-ai-azure.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth_router)
app.include_router(training_router)
app.include_router(nutrition_router)
app.include_router(food_scanner_router)
app.include_router(ai_coach_router)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "FitAI Backend is running"
    }
