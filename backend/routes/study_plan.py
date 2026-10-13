from flask import Blueprint, request, jsonify
import gemini_client

study_plan_bp = Blueprint("study_plan", __name__)


@study_plan_bp.route("/api/study-plan", methods=["POST"])
def generate_study_plan():
    data = request.get_json(force=True) or {}
    hours = data.get("hours", 2)
    today_focus = data.get("todayFocus", "")

    focus_instruction = (
        f'IMPORTANT: The single highest priority task today is: "{today_focus}". '
        f"Build the deepest, longest focus block of the day around this task specifically."
        if today_focus
        else ""
    )

    prompt = f"""
Build a realistic daily study timetable for a student with {hours} available
study hours today. Include short breaks. Return strict JSON in this shape:

{{
  "schedule": [
    {{ "time": "7:00 AM - 8:00 AM", "task": "string" }}
  ]
}}

Balance review, deep-focus learning, and hands-on practice. Keep task
descriptions specific and short (under 12 words).
{focus_instruction}
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        print(f"[study_plan] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502
