from flask import Blueprint, request, jsonify
import gemini_client

courses_bp = Blueprint("courses", __name__)


@courses_bp.route("/api/courses", methods=["POST"])
def recommend_courses():
    data = request.get_json(force=True) or {}
    profile = data.get("profile", {})
    career_goal = profile.get("careerGoal", "Software Developer")
    free_only = bool(data.get("freeOnly", False))

    free_only_instruction = (
        "IMPORTANT: Only recommend completely free courses (e.g. freeCodeCamp, "
        "YouTube, free-tier edX/Coursera audit mode, official docs-based courses). "
        "Do not include any paid-only courses."
        if free_only
        else ""
    )

    prompt = f"""
Recommend 6 real, well-known online courses that would help this learner
reach their career goal. Return strict JSON in this shape:

{{
  "courses": [
    {{
      "name": "string - exact real course name",
      "platform": "string - e.g. Coursera, Udemy, edX, freeCodeCamp, YouTube",
      "duration": "string - e.g. '6 weeks', '20 hours'",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "free": true or false,
      "searchQuery": "string - a good search query to find this course on its platform",
      "reason": "string - one short sentence on why THIS course fits this learner specifically"
    }}
  ]
}}

Learner's current skills: {profile.get('currentSkills', 'not specified')}
Learner's interests: {profile.get('interests', 'not specified')}
Career goal: {career_goal}

Only recommend courses that genuinely exist and are well-regarded. Mix
difficulty levels appropriately for someone working toward this goal.
Set "free" accurately based on whether the course can be completed at zero
cost (audit/free tiers count as free).
{free_only_instruction}
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        print(f"[courses] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502