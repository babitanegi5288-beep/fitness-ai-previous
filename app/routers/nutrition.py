from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone, date
import os
import httpx
from dotenv import load_dotenv

from app.database import get_db
from app.models import Diet, User
from app.schemas import NutritionAnalyzeRequest


load_dotenv()

USDA_API_KEY = os.getenv("USDA_API_KEY")


router = APIRouter(
    prefix="/api/nutrition",
    tags=["Nutrition"]
)


# ============================================================
# ANALYZE FOOD USING USDA
# ============================================================

async def analyze_food(food: str):

    if not USDA_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="USDA API key is not configured"
        )

    url = "https://api.nal.usda.gov/fdc/v1/foods/search"

    params = {
        "api_key": USDA_API_KEY,
        "query": food,
        "pageSize": 1
    }

    async with httpx.AsyncClient(timeout=15.0) as client:

        response = await client.get(
            url,
            params=params
        )

    if response.status_code != 200:

        raise HTTPException(
            status_code=502,
            detail="USDA FoodData Central API request failed"
        )

    data = response.json()

    foods = data.get("foods", [])

    if not foods:

        raise HTTPException(
            status_code=404,
            detail=f"Food '{food}' was not found"
        )

    selected_food = foods[0]

    nutrients = selected_food.get(
        "foodNutrients",
        []
    )

    nutrition = {
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "fiber": 0,
        "calories": 0
    }

    for nutrient in nutrients:

        name = nutrient.get(
            "nutrientName",
            ""
        ).lower()

        value = nutrient.get(
            "value",
            0
        ) or 0

        if "protein" in name:

            nutrition["protein"] = value

        elif "carbohydrate" in name:

            nutrition["carbs"] = value

        elif "total lipid" in name:

            nutrition["fat"] = value

        elif "fiber" in name:

            nutrition["fiber"] = value

        elif "energy" in name:

            nutrition["calories"] = value

    return nutrition


# ============================================================
# ADD FOOD
# ============================================================

@router.get("/food/{user_id}")
def get_food_logs(
    user_id: int,
    food_date: date | None = None,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.User_ID == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # If no date is provided, use today's date
    selected_date = food_date or date.today()

    diet_logs = (
        db.query(Diet)
        .filter(
            Diet.User_ID == user_id,
            Diet.Food_Date == selected_date
        )
        .order_by(Diet.Diet_ID.desc())
        .all()
    )

    foods = []

    for item in diet_logs:

        nutrition = {
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "calories": 0
        }

        text = item.Meal_Nutrition or ""

        try:
            parts = text.split(",")

            for part in parts:
                part = part.strip()

                if ":" not in part:
                    continue

                key, value = part.split(":", 1)
                value = value.strip()

                if "Protein" in key:
                    nutrition["protein"] = float(
                        value.replace("g", "").strip()
                    )

                elif "Carbs" in key:
                    nutrition["carbs"] = float(
                        value.replace("g", "").strip()
                    )

                elif "Fat" in key:
                    nutrition["fat"] = float(
                        value.replace("g", "").strip()
                    )

                elif "Fiber" in key:
                    nutrition["fiber"] = float(
                        value.replace("g", "").strip()
                    )

                elif "Calories" in key:
                    nutrition["calories"] = float(
                        value.replace("kcal", "").strip()
                    )

        except Exception:
            pass

        foods.append({
            "id": item.Diet_ID,
            "meal": item.Meal_Timing,
            "food": item.Meal,
            "protein": nutrition["protein"],
            "carbs": nutrition["carbs"],
            "fat": nutrition["fat"],
            "fiber": nutrition["fiber"],
            "calories": nutrition["calories"],
            "food_date": (
                item.Food_Date.isoformat()
                if item.Food_Date
                else None
            )
        })

    return {
        "user_id": user_id,
        "date": selected_date.isoformat(),
        "foods": foods
    }


# ============================================================
# GET FOOD LOGS
# ============================================================

@router.get("/food/{user_id}")
def get_food_logs(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.User_ID == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    diet_logs = (
        db.query(Diet)
        .filter(Diet.User_ID == user_id)
        .order_by(Diet.Diet_ID.desc())
        .all()
    )

    foods = []

    for item in diet_logs:

        nutrition = {

            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "calories": 0

        }

        text = item.Meal_Nutrition or ""

        try:

            parts = text.split(",")

            for part in parts:

                part = part.strip()

                if ":" not in part:
                    continue

                key, value = part.split(
                    ":",
                    1
                )

                value = value.strip()

                if "Protein" in key:

                    nutrition["protein"] = float(
                        value.replace(
                            "g",
                            ""
                        ).strip()
                    )

                elif "Carbs" in key:

                    nutrition["carbs"] = float(
                        value.replace(
                            "g",
                            ""
                        ).strip()
                    )

                elif "Fat" in key:

                    nutrition["fat"] = float(
                        value.replace(
                            "g",
                            ""
                        ).strip()
                    )

                elif "Fiber" in key:

                    nutrition["fiber"] = float(
                        value.replace(
                            "g",
                            ""
                        ).strip()
                    )

                elif "Calories" in key:

                    nutrition["calories"] = float(
                        value.replace(
                            "kcal",
                            ""
                        ).strip()
                    )

        except Exception:

            pass

        foods.append({

            "id": item.Diet_ID,

            "meal": item.Meal_Timing,

            "food": item.Meal,

            "protein": nutrition["protein"],

            "carbs": nutrition["carbs"],

            "fat": nutrition["fat"],

            "fiber": nutrition["fiber"],

            "calories": nutrition["calories"],

            "created_at": None

        })

    return {

        "user_id": user_id,

        "foods": foods

    }

# ============================================================
# ANALYZE MULTIPLE FOOD ITEMS
# ============================================================

async def analyze_food_items(food_text: str):

    # Different separators ko handle karega
    food_text = (
        food_text
        .replace("+", ",")
        .replace(" and ", ",")
        .replace(" & ", ",")
    )

    items = [
        item.strip()
        for item in food_text.split(",")
        if item.strip()
    ]

    total = {
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "fiber": 0,
        "calories": 0
    }

    item_results = []

    for item in items:

        try:
            nutrition = await analyze_food(item)

            total["protein"] += nutrition["protein"]
            total["carbs"] += nutrition["carbs"]
            total["fat"] += nutrition["fat"]
            total["fiber"] += nutrition["fiber"]
            total["calories"] += nutrition["calories"]

            item_results.append({
                "food": item,
                "nutrition": nutrition
            })

        except HTTPException:
            continue

    total["protein"] = round(total["protein"], 1)
    total["carbs"] = round(total["carbs"], 1)
    total["fat"] = round(total["fat"], 1)
    total["fiber"] = round(total["fiber"], 1)
    total["calories"] = round(total["calories"], 1)

    return total, item_results
# ============================================================
# ANALYZE TODAY'S FOOD
# ============================================================
@router.post("/analyze")
async def analyze_today_food(
    data: NutritionAnalyzeRequest,
    db: Session = Depends(get_db)
):

    # Check user
    user = db.query(User).filter(
        User.User_ID == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check food
    if not data.food.strip():
        raise HTTPException(
            status_code=400,
            detail="Food details are required"
        )

    # Meal structure
    meal_lines = {
        "Breakfast": "",
        "Lunch": "",
        "Snack": "",
        "Dinner": ""
    }

    food_text = data.food.strip()

    # --------------------------------------------------------
    # CASE 1: User enters only one food
    # Example: "poha"
    # Treat it as breakfast for testing.
    # --------------------------------------------------------

    has_meal_label = any(
        food_text.lower().startswith(label.lower() + ":")
        for label in meal_lines
    )

    if not has_meal_label:
        meal_lines["Breakfast"] = food_text

    # --------------------------------------------------------
    # CASE 2: User enters complete daily meals
    # --------------------------------------------------------

    else:

        for line in food_text.split("\n"):

            line = line.strip()

            if not line:
                continue

            if line.lower().startswith("breakfast:"):

                meal_lines["Breakfast"] = line.split(
                    ":",
                    1
                )[1].strip()

            elif line.lower().startswith("lunch:"):

                meal_lines["Lunch"] = line.split(
                    ":",
                    1
                )[1].strip()

            elif line.lower().startswith("snack:"):

                meal_lines["Snack"] = line.split(
                    ":",
                    1
                )[1].strip()

            elif line.lower().startswith("dinner:"):

                meal_lines["Dinner"] = line.split(
                    ":",
                    1
                )[1].strip()

    # --------------------------------------------------------
    # Total nutrition
    # --------------------------------------------------------

    total = {
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "fiber": 0,
        "calories": 0
    }

    analyzed_meals = []

    # --------------------------------------------------------
    # Analyze each meal
    # --------------------------------------------------------
    for meal_name, meal_food in meal_lines.items():

        if not meal_food:
            continue

        try:

            total_nutrition, item_results = await analyze_food_items(
                meal_food
            )

            total["protein"] += total_nutrition["protein"]
            total["carbs"] += total_nutrition["carbs"]
            total["fat"] += total_nutrition["fat"]
            total["fiber"] += total_nutrition["fiber"]
            total["calories"] += total_nutrition["calories"]

            analyzed_meals.append({
                "meal": meal_name,
                "food": meal_food,
                "nutrition": total_nutrition,
                "items": item_results
            })

        except HTTPException:
            continue
    
    # --------------------------------------------------------
    # Round values
    # --------------------------------------------------------

    total["protein"] = round(total["protein"], 1)
    total["carbs"] = round(total["carbs"], 1)
    total["fat"] = round(total["fat"], 1)
    total["fiber"] = round(total["fiber"], 1)
    total["calories"] = round(total["calories"], 1)

    # --------------------------------------------------------
    # Save analyzed meals
    # --------------------------------------------------------

    for item in analyzed_meals:

        nutrition = item["nutrition"]

        nutrition_text = (
            f"Protein: {nutrition['protein']} g, "
            f"Carbs: {nutrition['carbs']} g, "
            f"Fat: {nutrition['fat']} g, "
            f"Fiber: {nutrition['fiber']} g, "
            f"Calories: {nutrition['calories']} kcal"
        )

        diet = Diet(
            User_ID=data.user_id,
            Meal_Timing=item["meal"],
            Meal=item["food"],
            Meal_Nutrition=nutrition_text,
            Food_Date=date.today()
        )

        db.add(diet)

    db.commit()

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "summary": (
            "Your food has been analyzed using "
            "the available food nutrition data."
        ),

        "calories": f"{total['calories']} kcal",

        "protein": f"{total['protein']} g",

        "carbs": f"{total['carbs']} g",

        "fats": f"{total['fat']} g",

        "fiber": f"{total['fiber']} g",

        "benefits": (
            "A balanced diet can include carbohydrates "
            "for energy, protein for growth and repair, "
            "healthy fats, fiber, fruits and vegetables."
        ),

        "meals": analyzed_meals
    }
