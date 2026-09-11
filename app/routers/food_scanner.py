import os
import json
import re

from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from google import genai

load_dotenv()

router = APIRouter(
    prefix="/api/food-scanner",
    tags=["Food Scanner"]
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=GEMINI_API_KEY)


@router.post("/analyze")
async def analyze_food(file: UploadFile = File(...)):

    # Check file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    # Read image
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty."
        )

    prompt = """
Analyze this food image carefully.

Identify the food or product as accurately as possible.

Return ONLY valid JSON.
Do not use markdown.
Do not put the JSON inside ```.

Use exactly this structure:

{
  "food_name": "name of food/product",
  "ingredients": [],
  "calories": "Not available",
  "protein": "Not available",
  "carbs": "Not available",
  "fat": "Not available",
  "fiber": "Not available",
  "sugar": "Not available",
  "sodium": "Not available",
  "other_nutrients": [],
  "benefits": [],
  "things_to_consider": [],
  "source_type": "label-based or estimated"
}

IMPORTANT:

1. If a nutrition label is visible, extract the values from the label.
2. If ingredients are visible, list the ingredients.
3. If nutrition information is NOT visible, estimate only when the food
   can reasonably be identified.
4. Clearly mark estimated values using "Estimated".
5. Never invent information that cannot reasonably be determined.
6. Calories should be reported in kcal.
7. Protein, carbohydrates, fat and fiber should normally be reported in grams.
8. Sugar and sodium should be included when available.
9. Explain nutritional benefits based on the identified nutrients.
10. Mention things to consider such as high sugar, high sodium, or high
    saturated fat when the image provides enough evidence.
11. If something cannot be determined, use "Not available".
12. Do not make medical claims.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                prompt,
                {
                    "inline_data": {
                        "mime_type": file.content_type,
                        "data": image_bytes,
                    }
                },
            ],
        )

        raw_text = response.text.strip()

        # Remove accidental markdown code fences
        raw_text = re.sub(
            r"^```json\s*|\s*```$",
            "",
            raw_text,
            flags=re.IGNORECASE
        ).strip()

        # Convert Gemini response to JSON
        try:
            result = json.loads(raw_text)

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="AI returned an invalid analysis format."
            )

        return {
            "message": "Food image analyzed successfully",
            "filename": file.filename,

            "food_name": result.get(
                "food_name",
                "Food Analysis"
            ),

            "ingredients": result.get(
                "ingredients",
                []
            ),

            "calories": result.get(
                "calories",
                "Not available"
            ),

            "protein": result.get(
                "protein",
                "Not available"
            ),

            "carbs": result.get(
                "carbs",
                "Not available"
            ),

            "fat": result.get(
                "fat",
                "Not available"
            ),

            "fiber": result.get(
                "fiber",
                "Not available"
            ),

            "sugar": result.get(
                "sugar",
                "Not available"
            ),

            "sodium": result.get(
                "sodium",
                "Not available"
            ),

            "other_nutrients": result.get(
                "other_nutrients",
                []
            ),

            "benefits": result.get(
                "benefits",
                []
            ),

            "things_to_consider": result.get(
                "things_to_consider",
                []
            ),

            "source_type": result.get(
                "source_type",
                "Estimated"
            )
        }

    except HTTPException:
        raise

    except Exception as e:

        error_message = str(e)

        print(
            "Food scanner error:",
            error_message
        )

        if (
            "503" in error_message
            or "UNAVAILABLE" in error_message
        ):
            raise HTTPException(
                status_code=503,
                detail=(
                    "The AI service is temporarily busy. "
                    "Please try again in a little while."
                )
            )

        raise HTTPException(
            status_code=500,
            detail=f"Food analysis failed: {error_message}"
        ) 