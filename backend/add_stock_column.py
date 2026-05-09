from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE products ADD COLUMN stock_count INTEGER DEFAULT 0"))
        db.session.commit()
        print("Successfully added stock_count column")
    except Exception as e:
        print(f"Error: {e}")
