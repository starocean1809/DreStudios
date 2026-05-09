import sys
import os

# Add the backend directory to sys.path
backend_dir = r'c:\Users\Yuvaraj\Documents\Hari 3D Printer\backend'
sys.path.append(backend_dir)

from app import create_app, db
from app.models.review import Review

app = create_app()
with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully (including reviews).")
    except Exception as e:
        print(f"Error creating tables: {e}")
