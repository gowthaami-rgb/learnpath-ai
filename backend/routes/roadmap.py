from flask import Blueprint, request, jsonify
import gemini_client

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/api/roadmap", methods=["POST"])
def generate_roadmap():
    data = request.get_json(force=True) or {}
    profile = data.get("profile", {})
    assessment = data.get("assessment", {})

    level = assessment.get("level", "Beginner")
    career_goal = profile.get("careerGoal", "Software Developer")

    prompt = f"""
You are an expert learning coach. Build a 4-week personalized learning roadmap
as strict JSON (no markdown, no commentary) matching this shape exactly:

{{
  "level": "{level}",
  "careerGoal": "{career_goal}",
  "weeks": [
    {{
      "week": 1,
      "title": "string",
      "skills": ["string", "string", "string"],
      "project": "string - a specific hands-on project for this week",
      "milestone": "string - what the learner should be able to do by the end",
      "reason": "string - one short sentence explaining WHY this week was chosen for THIS learner specifically, referencing their profile/assessment (e.g. 'Recommended first because your assessment showed solid basics but no hands-on project experience yet.')"
    }}
  ]
}}

Learner profile:
- Current skills: {profile.get('currentSkills', 'not specified')}
- Interests: {profile.get('interests', 'not specified')}
- Career goal: {career_goal}
- Assessed level: {level}
- Daily study time available: {profile.get('dailyStudyTime', '1')} hours

Return exactly 4 weeks, each building on the last, appropriate for a {level} learner
working toward becoming a {career_goal}. Every week's "reason" must feel personal —
avoid generic phrasing like "this is important to learn."
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        # Surface a clear error; the frontend falls back to a sample roadmap on failure.
        print(f"[roadmap] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502