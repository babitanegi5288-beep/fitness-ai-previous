from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core import hash_password
from app.database import get_db
from app.models import User
from app.schemas import UserCreate


router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.post("/")
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check whether the email is already registered
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered"
        )

    # Convert the real password into a secure hash
    hashed_password = hash_password(user_data.password)

    # Create the database user
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        sport=user_data.sport,
        goal=user_data.goal
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Never return the password or password hash
    return {
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "sport": user.sport,
            "goal": user.goal
        }
    }