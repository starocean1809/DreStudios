from app import db, create_app
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN profile_image TEXT"))
        db.session.commit()
        print("Profile image column added successfully")
    except Exception as e:
        print(f"Error: {e}")
