"""
LearnPath AI backend — Flask + Gemini API.

Run with:
    python app.py

Make sure to:
1. Create a virtual environment and `pip install -r requirements.txt`
2. Copy .env.example to .env and add your GEMINI_API_KEY
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.roadmap import roadmap_bp
from routes.study_plan import study_plan_bp
from routes.skill_gap import skill_gap_bp
from routes.chat import chat_bp
from routes.courses import courses_bp
from routes.code_review import code_review_bp
from routes.week_quiz import week_quiz_bp
from routes.today_focus import today_focus_bp
import gemini_client

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow the React dev server (localhost:5173) to call this API

app.register_blueprint(roadmap_bp)
app.register_blueprint(study_plan_bp)
app.register_blueprint(skill_gap_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(code_review_bp)
app.register_blueprint(week_quiz_bp)
app.register_blueprint(today_focus_bp)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "gemini_configured": gemini_client.is_configured(),
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)