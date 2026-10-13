from flask import Blueprint, request, jsonify
import gemini_client

chat_bp = Blueprint("chat", __name__)

SYSTEM_INSTRUCTION = (
    "You are LearnPath AI's study assistant. You help students figure out what "
    "to learn next, explain technical topics clearly with simple examples, "
    "suggest hands-on projects, and help with interview preparation. Keep "
    "answers concise, encouraging, and practical — a few short paragraphs at most."
)


@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True) or {}
    message = data.get("message", "")
    history = data.get("history", [])

    # Build a short conversation transcript for context
    transcript = "\n".join(
        f"{'Student' if h.get('role') == 'user' else 'Assistant'}: {h.get('text', '')}"
        for h in history[-6:]  # keep last few turns to bound prompt size
    )

    prompt = f"{transcript}\n\nStudent: {message}\nAssistant:"

    try:
        reply = gemini_client.generate_text(prompt, system_instruction=SYSTEM_INSTRUCTION)
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"[chat] Gemini call failed: {e}")
        return jsonify({"error": str(e)}), 502
