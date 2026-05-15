from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        print("Cleaning up orders table constraints...")
        # Make product_id and quantity nullable in orders table
        # We use ALTER TABLE ... ALTER COLUMN ... DROP NOT NULL
        db.session.execute(text("ALTER TABLE orders ALTER COLUMN product_id DROP NOT NULL"))
        db.session.execute(text("ALTER TABLE orders ALTER COLUMN quantity DROP NOT NULL"))
        
        db.session.commit()
        print("Successfully made product_id and quantity columns nullable in orders table")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error during migration: {e}")
