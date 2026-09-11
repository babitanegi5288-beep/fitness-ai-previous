from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core import create_access_token, hash_password
from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserCreate, UserLogin
from app.services import authenticate_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ============================================================
# SIGN UP
# ============================================================

@router.post("/signup")
def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.Email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create user
    user = User(
        Name=user_data.name,
        Email=user_data.email,
        Password=hash_password(user_data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create complete profile
    profile = UserProfile(
        User_ID=user.User_ID,
        Experience_Level=user_data.experience_level or "Beginner",
        Sports=user_data.sport or "General Fitness",
        Goal=user_data.goal or "Improve Fitness",
        Age=user_data.age,
        Height=user_data.height,
        Weight=user_data.weight,
        Gender=user_data.gender
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return {
        "message": "Account created successfully",
        "user": {
            "id": user.User_ID,
            "name": user.Name,
            "email": user.Email,
            "gender": profile.Gender,
            "age": profile.Age,
            "height": float(profile.Height) if profile.Height is not None else None,
            "weight": float(profile.Weight) if profile.Weight is not None else None,
            "sport": profile.Sports,
            "goal": profile.Goal,
            "experience_level": profile.Experience_Level
        }
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db=db,
        email=user_data.email,
        password=user_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Get user profile
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.User_ID == user.User_ID)
        .first()
    )

    # Create JWT token
    access_token = create_access_token(
        data={
            "sub": str(user.User_ID),
            "email": user.Email
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.User_ID,
            "name": user.Name,
            "email": user.Email,
            "gender": profile.Gender if profile else None,
            "age": profile.Age if profile else None,
            "height": (
                float(profile.Height)
                if profile and profile.Height is not None
                else None
            ),
            "weight": (
                float(profile.Weight)
                if profile and profile.Weight is not None
                else None
            ),
            "sport": profile.Sports if profile else None,
            "goal": profile.Goal if profile else None,
            "experience_level": (
                profile.Experience_Level
                if profile
                else "Beginner"
            )
        }
    }


# ============================================================
# UPDATE PROFILE
# ============================================================

@router.put("/profile/{user_id}")
def update_profile(
    user_id: int,
    user_data: dict,
    db: Session = Depends(get_db)
):
    # Find user
    user = (
        db.query(User)
        .filter(User.User_ID == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Update User table
    if user_data.get("name") is not None:
        user.Name = user_data["name"]

    if user_data.get("email") is not None:
        user.Email = user_data["email"]

    # Find profile
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.User_ID == user_id)
        .first()
    )

    # If profile doesn't exist, create it
    if not profile:
        profile = UserProfile(
            User_ID=user_id,
            Experience_Level="Beginner",
            Sports="General Fitness",
            Goal="Improve Fitness"
        )

        db.add(profile)
        db.flush()

    # Update profile fields
    if user_data.get("gender") is not None:
        profile.Gender = user_data["gender"]

    if user_data.get("age") is not None:
        profile.Age = user_data["age"]

    if user_data.get("height") is not None:
        profile.Height = user_data["height"]

    if user_data.get("weight") is not None:
        profile.Weight = user_data["weight"]

    if user_data.get("level") is not None:
        profile.Experience_Level = user_data["level"]

    if user_data.get("experience_level") is not None:
        profile.Experience_Level = user_data["experience_level"]

    if user_data.get("sport") is not None:
        profile.Sports = user_data["sport"]

    if user_data.get("goal") is not None:
        profile.Goal = user_data["goal"]

    # Save changes
    db.commit()
    db.refresh(user)
    db.refresh(profile)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.User_ID,
            "name": user.Name,
            "email": user.Email,
            "gender": profile.Gender,
            "age": profile.Age,
            "height": (
                float(profile.Height)
                if profile.Height is not None
                else None
            ),
            "weight": (
                float(profile.Weight)
                if profile.Weight is not None
                else None
            ),
            "sport": profile.Sports,
            "goal": profile.Goal,
            "experience_level": profile.Experience_Level
        }
    }