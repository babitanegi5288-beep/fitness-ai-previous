from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import Training, User


router = APIRouter(
    prefix="/api/training",
    tags=["Training"]
)


# ============================================================
# GET TRAINING
# ============================================================
@router.get("/exercises")
def get_exercises(
    user_id: int,
    sport: str,
    goal: str,
    db: Session = Depends(get_db)
):
    # Check user
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

    # ------------------------------------------------------------
    # PERSONALIZED EXERCISE DATA
    # Based on SPORT + GOAL
    # ------------------------------------------------------------

    exercise_plans = {

        "Football": {
            "Improve Fitness": [
                {
                    "id": "football-warmup",
                    "name": "Dynamic Warm-Up",
                    "how_to_do": [
                        "Start with light jogging.",
                        "Move your arms naturally while jogging.",
                        "Gradually increase your movement.",
                        "Keep your body controlled."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "football-high-knees",
                    "name": "High Knees",
                    "how_to_do": [
                        "Stand upright with your feet shoulder-width apart.",
                        "Lift one knee toward your waist.",
                        "Lower it and lift the opposite knee.",
                        "Continue at a controlled pace."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "football-shuttle",
                    "name": "Shuttle Run",
                    "how_to_do": [
                        "Mark two safe points a short distance apart.",
                        "Run from one point to the other.",
                        "Slow down before changing direction.",
                        "Repeat while maintaining control."
                    ],
                    "duration_seconds": 45
                },
                {
                    "id": "football-control",
                    "name": "Ball Control",
                    "how_to_do": [
                        "Keep the football close to your feet.",
                        "Use gentle touches with both feet.",
                        "Keep your body balanced.",
                        "Practice controlling the ball while moving."
                    ],
                    "duration_seconds": 40
                }
            ],

            "Build Strength": [
                {
                    "id": "football-squats",
                    "name": "Bodyweight Squats",
                    "how_to_do": [
                        "Stand with your feet about shoulder-width apart.",
                        "Bend your knees and lower your hips.",
                        "Keep your back comfortable and controlled.",
                        "Return to the standing position."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "football-lunges",
                    "name": "Forward Lunges",
                    "how_to_do": [
                        "Stand upright.",
                        "Step one foot forward.",
                        "Lower your body in a controlled movement.",
                        "Return to the starting position and switch legs."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "football-plank",
                    "name": "Plank",
                    "how_to_do": [
                        "Place your hands or forearms on a stable surface.",
                        "Keep your body in a straight line.",
                        "Engage your core gently.",
                        "Hold the position while breathing normally."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "football-balance",
                    "name": "Single-Leg Balance",
                    "how_to_do": [
                        "Stand near a stable support if needed.",
                        "Lift one foot slightly from the floor.",
                        "Keep your body balanced.",
                        "Switch legs after the timer."
                    ],
                    "duration_seconds": 30
                }
            ],

            "Improve Speed": [
                {
                    "id": "football-fast-feet",
                    "name": "Fast Feet",
                    "how_to_do": [
                        "Stand with your feet comfortably apart.",
                        "Move your feet quickly in small steps.",
                        "Keep your knees slightly bent.",
                        "Maintain control throughout the movement."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "football-shuttle-speed",
                    "name": "Short Shuttle Run",
                    "how_to_do": [
                        "Choose two safe points.",
                        "Move quickly between the points.",
                        "Slow down before turning.",
                        "Focus on controlled acceleration."
                    ],
                    "duration_seconds": 40
                }
            ]
        },

        "Cricket": {
            "Improve Fitness": [
                {
                    "id": "cricket-warmup",
                    "name": "Dynamic Warm-Up",
                    "how_to_do": [
                        "Start with light jogging.",
                        "Move your arms and shoulders gently.",
                        "Gradually increase your movement.",
                        "Keep your breathing comfortable."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "cricket-high-knees",
                    "name": "High Knees",
                    "how_to_do": [
                        "Stand upright.",
                        "Lift one knee at a time.",
                        "Keep your upper body controlled.",
                        "Continue at a comfortable pace."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "cricket-footwork",
                    "name": "Batting Footwork",
                    "how_to_do": [
                        "Start in a comfortable batting stance.",
                        "Practice moving your front foot forward.",
                        "Return to your starting position.",
                        "Repeat with controlled movement."
                    ],
                    "duration_seconds": 45
                },
                {
                    "id": "cricket-reaction",
                    "name": "Reaction Drill",
                    "how_to_do": [
                        "Stand in a ready position.",
                        "Choose a safe visual target.",
                        "Move toward the target when prompted.",
                        "Return to your ready position."
                    ],
                    "duration_seconds": 40
                }
            ],

            "Build Strength": [
                {
                    "id": "cricket-squats",
                    "name": "Bodyweight Squats",
                    "how_to_do": [
                        "Stand with your feet comfortably apart.",
                        "Lower your hips in a controlled movement.",
                        "Keep your knees aligned comfortably.",
                        "Return to standing."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "cricket-plank",
                    "name": "Plank",
                    "how_to_do": [
                        "Use your hands or forearms for support.",
                        "Keep your body aligned.",
                        "Engage your core gently.",
                        "Breathe normally while holding."
                    ],
                    "duration_seconds": 30
                }
            ]
        },

        "Basketball": {
            "Improve Fitness": [
                {
                    "id": "basketball-warmup",
                    "name": "Dynamic Warm-Up",
                    "how_to_do": [
                        "Start with light movement.",
                        "Move your arms and legs naturally.",
                        "Gradually increase your pace.",
                        "Stay balanced."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "basketball-footwork",
                    "name": "Defensive Footwork",
                    "how_to_do": [
                        "Start in a comfortable athletic stance.",
                        "Keep your knees slightly bent.",
                        "Move sideways using controlled steps.",
                        "Keep your balance while changing direction."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "basketball-dribble",
                    "name": "Dribbling",
                    "how_to_do": [
                        "Keep the basketball close to your body.",
                        "Bounce it gently with one hand.",
                        "Keep your head up when possible.",
                        "Switch hands and maintain control."
                    ],
                    "duration_seconds": 45
                },
                {
                    "id": "basketball-shooting",
                    "name": "Shooting Practice",
                    "how_to_do": [
                        "Stand in a balanced shooting position.",
                        "Hold the ball comfortably.",
                        "Aim toward the basket.",
                        "Practice controlled shooting technique."
                    ],
                    "duration_seconds": 45
                }
            ],

            "Build Strength": [
                {
                    "id": "basketball-squats",
                    "name": "Bodyweight Squats",
                    "how_to_do": [
                        "Stand with your feet comfortably apart.",
                        "Lower your hips slowly.",
                        "Keep your movement controlled.",
                        "Return to standing."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "basketball-plank",
                    "name": "Plank",
                    "how_to_do": [
                        "Place your hands or forearms on a stable surface.",
                        "Keep your body aligned.",
                        "Engage your core gently.",
                        "Breathe normally."
                    ],
                    "duration_seconds": 30
                }
            ]
        },

        "Tennis": {
            "Improve Fitness": [
                {
                    "id": "tennis-warmup",
                    "name": "Dynamic Warm-Up",
                    "how_to_do": [
                        "Start with light movement.",
                        "Move your arms and legs naturally.",
                        "Gradually increase your pace.",
                        "Stay relaxed and balanced."
                    ],
                    "duration_seconds": 30
                },
                {
                    "id": "tennis-footwork",
                    "name": "Court Footwork",
                    "how_to_do": [
                        "Start in a ready position.",
                        "Move sideways using small controlled steps.",
                        "Keep your knees slightly bent.",
                        "Return to the ready position."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "tennis-shadow",
                    "name": "Shadow Swing",
                    "how_to_do": [
                        "Stand in a comfortable tennis stance.",
                        "Practice the swing without a ball.",
                        "Focus on smooth controlled movement.",
                        "Return to your ready position."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "tennis-reaction",
                    "name": "Reaction Drill",
                    "how_to_do": [
                        "Start in your ready position.",
                        "Choose a safe target direction.",
                        "Move toward the target.",
                        "Return to your starting position."
                    ],
                    "duration_seconds": 40
                }
            ],

            "Build Strength": [
                {
                    "id": "tennis-squats",
                    "name": "Bodyweight Squats",
                    "how_to_do": [
                        "Stand with your feet comfortably apart.",
                        "Lower your hips in a controlled movement.",
                        "Keep your knees comfortable.",
                        "Return to standing."
                    ],
                    "duration_seconds": 40
                },
                {
                    "id": "tennis-balance",
                    "name": "Single-Leg Balance",
                    "how_to_do": [
                        "Stand near stable support if needed.",
                        "Lift one foot slightly.",
                        "Maintain your balance.",
                        "Switch sides after the timer."
                    ],
                    "duration_seconds": 30
                }
            ]
        }
    }

    # Find the selected sport
    sport_plan = exercise_plans.get(sport)

    # If the sport is not available, use Football as fallback
    if not sport_plan:
        sport_plan = exercise_plans["Football"]

    # Find the selected goal
    exercises = sport_plan.get(goal)

    # If that goal is not available, use Improve Fitness
    if not exercises:
        exercises = sport_plan.get(
            "Improve Fitness",
            list(sport_plan.values())[0]
        )

    return {
        "sport": sport,
        "goal": goal,
        "exercises": exercises
    }

# ============================================================
# SAVE TRAINING PROGRESS
# ============================================================

@router.post("/progress")
def save_progress(
    user_id: int,
    drill_name: str,
    duration_minutes: int = 1,
    db: Session = Depends(get_db)
):

    # Check user
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

    # Create training record
    training = Training(
        User_ID=user_id,
        Drill_Name=drill_name,
        Training_Date=datetime.now(
            timezone.utc
        ).isoformat(),
        Duration_Minutes=duration_minutes
    )

    db.add(training)
    db.commit()
    db.refresh(training)

    return {
        "message": "Training completed successfully",
        "training_id": training.Training_ID,
        "user_id": user_id,
        "drill_name": drill_name,
        "completed": True
    }