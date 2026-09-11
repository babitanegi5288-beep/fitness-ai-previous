import os
import time
from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database import get_db
from app.models import AICoachChat


load_dotenv()

router = APIRouter(
    prefix="/api/ai-coach",
    tags=["AI Coach"]
)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=GEMINI_API_KEY)


class CoachRequest(BaseModel):
    user_id: int
    question: str
    sport: str | None = None
    goal: str | None = None


@router.post("/ask")
async def ask_coach(
    request: CoachRequest,
    db: Session = Depends(get_db)
):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter a question."
        )

    sport = request.sport or "general fitness"
    goal = request.goal or "general fitness"

    prompt = f"""
You are the AI Coach for a fitness and sports learning application called FITNESS-AI.

User's selected sport: {sport}
User's goal/purpose: {goal}

User's question:
{request.question}

Give a helpful, clear and encouraging answer.

The user can ask general questions as well as questions about:
- sports
- training
- exercise
- fitness
- recovery
- nutrition
- daily routine
- learning

Answer the user's actual question directly.

Do not give dangerous instructions.
Do not diagnose medical conditions.
If the question is medical or involves an injury, recommend speaking with a qualified healthcare professional.

Keep the answer short and simple.
Give only 2-4 sentences unless the user specifically asks for a detailed explanation.
Avoid long introductions and unnecessary sections.
"""

    try:
        response = None

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=prompt
                )

                break

            except Exception as e:
                error_message = str(e)

                if (
                    "503" in error_message
                    or "UNAVAILABLE" in error_message
                ):
                    if attempt < 2:
                        time.sleep(2 ** attempt)
                        continue

                raise e

        if response is None:
            raise HTTPException(
                status_code=503,
                detail="The AI service is temporarily busy. Please try again later."
            )

        answer = response.text

        # Save chat history in SQL Server
        chat = AICoachChat(
            User_ID=request.user_id,
            Question=request.question,
            Answer=answer,
            Chat_Date=date.today()
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return {
            "success": True,
            "chat_id": chat.Chat_ID,
            "answer": answer,
            "date": chat.Chat_Date
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        error_message = str(e)

        if (
            "503" in error_message
            or "UNAVAILABLE" in error_message
        ):
            raise HTTPException(
                status_code=503,
                detail="The AI service is temporarily busy. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail=f"AI Coach failed: {error_message}"
        )
@router.get("/history/{user_id}")
async def get_chat_history(
    user_id: int,
    db: Session = Depends(get_db)
):
    chats = (
        db.query(AICoachChat)
        .filter(AICoachChat.User_ID == user_id)
        .order_by(AICoachChat.Chat_ID.asc())
        .all()
    )

    return {
        "success": True,
        "history": [
            {
                "chat_id": chat.Chat_ID,
                "question": chat.Question,
                "answer": chat.Answer,
                "date": chat.Chat_Date
            }
            for chat in chats
        ]
    }