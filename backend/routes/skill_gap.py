from flask import Blueprint, request, jsonify
import gemini_client

skill_gap_bp = Blueprint("skill_gap", __name__)


@skill_gap_bp.route("/api/skill-gap", methods=["POST"])
def analyze_skill_gap():
    data = request.get_json(force=True) or {}
    profile = data.get("profile", {})
    career_goal = data.get("careerGoal") or profile.get("careerGoal", "Software Developer")

    prompt = f"""
Compare this learner's current skills against what's required for their
career goal. Return strict JSON in this shape:

{{
  "careerGoal": "{career_goal}",
  "haveSkills": ["string", "string"],
  "improveSkills": ["string", "string", "string"],
  "nextSteps": ["string", "string", "string"]
}}

Learner's current skills: {profile.get('currentSkills', 'not specified')}
Learner's interests: {profile.get('interests', 'not specified')}
Career goal: {career_goal}

Be specific and realistic about what's genuinely required for this role today.
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        print(f"[skill_gap] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502
