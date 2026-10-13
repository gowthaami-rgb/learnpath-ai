from flask import Blueprint, request, jsonify
import gemini_client

week_quiz_bp = Blueprint("week_quiz", __name__)


@week_quiz_bp.route("/api/week-quiz", methods=["POST"])
def generate_week_quiz():
    data = request.get_json(force=True) or {}
    week = data.get("week", {})

    title = week.get("title", "this topic")
    skills = week.get("skills", [])
    project = week.get("project", "")
    milestone = week.get("milestone", "")

    prompt = f"""
Create a short 4-question multiple-choice quiz that checks whether a
learner has actually understood this week of their learning roadmap.
Return strict JSON in this shape:

{{
  "questions": [
    {{
      "id": "q1",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string - one short sentence on why this answer is correct"
    }}
  ]
}}

Roadmap week: {title}
Skills covered: {', '.join(skills) if skills else 'not specified'}
Project for this week: {project}
Expected milestone: {milestone}

Questions should test practical understanding, not trivia — favor "what would
happen if..." or "which approach is correct for..." style questions over
pure definition recall. Keep each question and option short and clear.
Exactly 4 questions, each with exactly 4 options, correctIndex 0-3.
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        print(f"[week_quiz] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502