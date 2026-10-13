from flask import Blueprint, request, jsonify
import gemini_client

code_review_bp = Blueprint("code_review", __name__)

SYSTEM_INSTRUCTION = (
    "You are a friendly, encouraging code reviewer for students learning to "
    "program. Point out real issues (bugs, bad practices, missed edge cases) "
    "but always explain WHY something matters, not just what to change. Keep "
    "feedback constructive and specific to the code given — never generic."
)


@code_review_bp.route("/api/code-review", methods=["POST"])
def review_code():
    data = request.get_json(force=True) or {}
    code = data.get("code", "")
    language = data.get("language", "auto-detect the language")

    if not code.strip():
        return jsonify({"error": "No code provided"}), 400

    prompt = f"""
Review this student's code ({language}). Return strict JSON in this shape:

{{
  "summary": "string - one or two sentence overall verdict",
  "strengths": ["string", "string"],
  "issues": [
    {{
      "problem": "string - what's wrong",
      "why_it_matters": "string - why this matters, in plain language",
      "suggestion": "string - a specific fix or improvement"
    }}
  ],
  "improvedCode": "string - the corrected/improved version of the code, or empty string if no changes needed"
}}

Code to review:
{code}
"""

    try:
        result = gemini_client.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)
        return jsonify(result)
    except Exception as e:
        print(f"[code_review] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502