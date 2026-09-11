from app.database import SessionLocal
from app.models import Exercise


training_data = [

    # =========================================================
    # BASKETBALL
    # =========================================================

    {
        "name": "Basketball Jogging",
        "description": "Jog at a comfortable pace to build general fitness.",
        "sport": "Basketball",
        "goal": "Improve Fitness",
        "duration_seconds": 60
    },
    {
        "name": "Jumping Jacks",
        "description": "Perform controlled jumping jacks.",
        "sport": "Basketball",
        "goal": "Improve Fitness",
        "duration_seconds": 45
    },
    {
        "name": "Defensive Slides",
        "description": "Move side to side while maintaining a controlled defensive stance.",
        "sport": "Basketball",
        "goal": "Improve Performance",
        "duration_seconds": 45
    },
    {
        "name": "Court Sprints",
        "description": "Perform short controlled sprints across the court.",
        "sport": "Basketball",
        "goal": "Improve Performance",
        "duration_seconds": 30
    },
    {
        "name": "Dribbling Drill",
        "description": "Practice controlled basketball dribbling with both hands.",
        "sport": "Basketball",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Chest Pass Drill",
        "description": "Practice accurate chest passes with controlled technique.",
        "sport": "Basketball",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Light Court Walk",
        "description": "Walk comfortably around the court.",
        "sport": "Basketball",
        "goal": "Stay Active",
        "duration_seconds": 60
    },
    {
        "name": "Gentle Stretching",
        "description": "Perform gentle stretches with controlled movements.",
        "sport": "Basketball",
        "goal": "Stay Active",
        "duration_seconds": 45
    },


    # =========================================================
    # CRICKET
    # =========================================================

    {
        "name": "Cricket Jogging",
        "description": "Jog at a comfortable pace to build general fitness.",
        "sport": "Cricket",
        "goal": "Improve Fitness",
        "duration_seconds": 60
    },
    {
        "name": "Bodyweight Squats",
        "description": "Perform controlled bodyweight squats.",
        "sport": "Cricket",
        "goal": "Improve Fitness",
        "duration_seconds": 45
    },
    {
        "name": "Shuttle Runs",
        "description": "Move between two points with controlled changes of direction.",
        "sport": "Cricket",
        "goal": "Improve Performance",
        "duration_seconds": 45
    },
    {
        "name": "Quick Feet",
        "description": "Perform quick controlled foot movements in place.",
        "sport": "Cricket",
        "goal": "Improve Performance",
        "duration_seconds": 30
    },
    {
        "name": "Batting Footwork",
        "description": "Practice controlled batting footwork without rushing.",
        "sport": "Cricket",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Catching Drill",
        "description": "Practice safe and controlled catching technique.",
        "sport": "Cricket",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Light Cricket Walk",
        "description": "Walk comfortably around the playing area.",
        "sport": "Cricket",
        "goal": "Stay Active",
        "duration_seconds": 60
    },
    {
        "name": "Gentle Mobility",
        "description": "Perform gentle mobility movements at a comfortable pace.",
        "sport": "Cricket",
        "goal": "Stay Active",
        "duration_seconds": 45
    },


    # =========================================================
    # TENNIS
    # =========================================================

    {
        "name": "Tennis Jogging",
        "description": "Jog comfortably to build general fitness.",
        "sport": "Tennis",
        "goal": "Improve Fitness",
        "duration_seconds": 60
    },
    {
        "name": "Lunges",
        "description": "Perform controlled alternating lunges.",
        "sport": "Tennis",
        "goal": "Improve Fitness",
        "duration_seconds": 45
    },
    {
        "name": "Side-to-Side Steps",
        "description": "Move side to side with controlled footwork.",
        "sport": "Tennis",
        "goal": "Improve Performance",
        "duration_seconds": 45
    },
    {
        "name": "Court Sprints",
        "description": "Perform short controlled movements across the court.",
        "sport": "Tennis",
        "goal": "Improve Performance",
        "duration_seconds": 30
    },
    {
        "name": "Forehand Practice",
        "description": "Practice controlled forehand movement and technique.",
        "sport": "Tennis",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Backhand Practice",
        "description": "Practice controlled backhand movement and technique.",
        "sport": "Tennis",
        "goal": "Learn Sports Skills",
        "duration_seconds": 60
    },
    {
        "name": "Easy Court Walk",
        "description": "Walk comfortably around the tennis court.",
        "sport": "Tennis",
        "goal": "Stay Active",
        "duration_seconds": 60
    },
    {
        "name": "Gentle Stretching",
        "description": "Perform gentle stretches with controlled movements.",
        "sport": "Tennis",
        "goal": "Stay Active",
        "duration_seconds": 45
    },
]


def seed_training_data():
    db = SessionLocal()

    try:
        added = 0

        for exercise_data in training_data:

            existing_exercise = (
                db.query(Exercise)
                .filter(
                    Exercise.name == exercise_data["name"],
                    Exercise.sport == exercise_data["sport"],
                    Exercise.goal == exercise_data["goal"]
                )
                .first()
            )

            if existing_exercise:
                continue

            exercise = Exercise(**exercise_data)

            db.add(exercise)
            added += 1

        db.commit()

        print(
            f"Training data added successfully! "
            f"{added} new exercises added."
        )

    finally:
        db.close()


if __name__ == "__main__":
    seed_training_data()