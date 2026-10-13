from flask import Blueprint, request, jsonify
import gemini_client

today_focus_bp = Blueprint("today_focus", __name__)


@today_focus_bp.route("/api/today-focus", methods=["POST"])
def get_today_focus():
    data = request.get_json(force=True) or {}
    roadmap = data.get("roadmap", {})
    profile = data.get("profile", {})
    week_confidence = data.get("weekConfidence", {})

    weeks = roadmap.get("weeks", [])
    weeks_summary = "\n".join(
        f"Week {w.get('week')}: {w.get('title')} — skills: {', '.join(w.get('skills', []))} "
        f"— confidence: {week_confidence.get(str(w.get('week')), week_confidence.get(w.get('week'), 'not marked'))}"
        for w in weeks
    )

    prompt = f"""
Based on this student's roadmap and how confident they've marked each week,
pick exactly ONE specific, concrete thing they should focus on today. Return
strict JSON in this shape:

{{
  "focus": "string - one specific, actionable task for today (under 20 words)",
  "reason": "string - one short sentence on why this is today's priority"
}}

Career goal: {profile.get('careerGoal', 'not specified')}
Daily study time available: {profile.get('dailyStudyTime', '1')} hours

Roadmap weeks and confidence levels:
{weeks_summary if weeks_summary else 'No roadmap weeks available yet.'}

Prioritize weeks marked "revisit" over untouched weeks. If everything is
confident or unmarked, pick the next logical unstarted topic. Be specific —
not "review JavaScript" but something like "Practice 3 array methods:
map, filter, reduce, using real examples."
"""

    try:
        result = gemini_client.generate_json(
            prompt,
            system_instruction="You output only valid JSON. Never include markdown fences or explanation text.",
        )
        return jsonify(result)
    except Exception as e:
        print(f"[today_focus] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502