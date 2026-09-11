from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Date
from sqlalchemy.orm import relationship

from app.database import Base


# ============================================================
# USERS TABLE
# ============================================================

class User(Base):
    __tablename__ = "Users"

    User_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Email = Column(String(100), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)

    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False
    )

    training = relationship(
        "Training",
        back_populates="user"
    )

    diet = relationship(
        "Diet",
        back_populates="user"
    )


# ============================================================
# USER PROFILE TABLE
# ============================================================

class UserProfile(Base):
    __tablename__ = "User_Profile"

    Profile_ID = Column(Integer, primary_key=True, index=True)

    User_ID = Column(
        Integer,
        ForeignKey("Users.User_ID"),
        nullable=False
    )

    Experience_Level = Column(String(50), nullable=False)
    Sports = Column(String(100), nullable=False)
    Goal = Column(String(100), nullable=False)

    Age = Column(Integer, nullable=True)
    Height = Column(Numeric(5, 2), nullable=True)
    Weight = Column(Numeric(5, 2), nullable=True)

   
    Gender = Column(String(20), nullable=True)

    user = relationship(
        "User",
        back_populates="profile"
    )


# ============================================================
# TRAINING TABLE
# ============================================================

class Training(Base):
    __tablename__ = "Training"

    Training_ID = Column(Integer, primary_key=True, index=True)

    User_ID = Column(
        Integer,
        ForeignKey("Users.User_ID"),
        nullable=False
    )

    Drill_Name = Column(String(100), nullable=False)
    Training_Date = Column(String(50), nullable=False)
    Duration_Minutes = Column(Integer, nullable=True)

    user = relationship(
        "User",
        back_populates="training"
    )


# ============================================================
# DIET TABLE
# ============================================================

class Diet(Base):
    __tablename__ = "Diet"

    Diet_ID = Column(Integer, primary_key=True, index=True)

    User_ID = Column(
        Integer,
        ForeignKey("Users.User_ID"),
        nullable=False
    )

    Meal_Timing = Column(String(50), nullable=False)
    Meal = Column(String(100), nullable=False)
    Meal_Nutrition = Column(String(150), nullable=True)
    Food_Date = Column(Date, nullable=True)
    user = relationship(
        "User",
        back_populates="diet"
    )
class AICoachChat(Base):
    __tablename__ = "AI_Coach_Chat"

    Chat_ID = Column(Integer, primary_key=True, index=True)
    User_ID = Column(Integer, ForeignKey("Users.User_ID"), nullable=False)
    Question = Column(String, nullable=False)
    Answer = Column(String, nullable=False)
    Chat_Date = Column(Date, nullable=False)

    user = relationship("User")