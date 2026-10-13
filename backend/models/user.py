"""
Placeholder data model for a user profile.

This project ships with the frontend storing state in the browser so it's
runnable immediately. To persist data server-side, wire this up with
SQLAlchemy (MySQL) or the Firebase Admin SDK (Firestore) — whichever you
chose in your project setup — and connect it in app.py.

Example SQLAlchemy version:

    from flask_sqlalchemy import SQLAlchemy
    db = SQLAlchemy()

    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(120))
        email = db.Column(db.String(120), unique=True)
        school = db.Column(db.String(120))
        class_year = db.Column(db.String(50))
        department = db.Column(db.String(120))
        current_skills = db.Column(db.Text)
        interests = db.Column(db.Text)
        career_goal = db.Column(db.String(120))
        daily_study_time = db.Column(db.String(20))
"""
