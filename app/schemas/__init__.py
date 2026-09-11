from pydantic import BaseModel, Field


# ============================================================
# SIGN UP
# ============================================================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=8, max_length=128)

    gender: str | None = Field(default=None, max_length=20)
    age: int | None = Field(default=None, ge=1, le=120)
    height: float | None = Field(default=None, ge=50, le=250)
    weight: float | None = Field(default=None, ge=20, le=300)

    sport: str | None = Field(default=None, max_length=100)
    goal: str | None = Field(default=None, max_length=100)
    experience_level: str | None = Field(default=None, max_length=50)


# ============================================================
# LOGIN
# ============================================================

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=8, max_length=128)
    
# ============================================================
# NUTRITION ANALYSIS
# ============================================================

class NutritionAnalyzeRequest(BaseModel):
    user_id: int
    food: str