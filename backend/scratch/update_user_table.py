from app import db, create_app
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(255)"))
        db.session.execute(text("ALTER TABLE users ADD COLUMN city VARCHAR(100)"))
        db.session.execute(text("ALTER TABLE users ADD COLUMN zip_code VARCHAR(20)"))
        db.session.commit()
        print("Columns added successfully")
    except Exception as e:
        print(f"Error: {e}")
