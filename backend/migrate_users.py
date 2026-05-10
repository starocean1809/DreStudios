from app import create_app, db
from sqlalchemy import text

def migrate():
    app = create_app()
    with app.app_context():
        # Using raw SQL to alter table
        queries = [
            "ALTER TABLE users ADD COLUMN name VARCHAR(120);",
            "ALTER TABLE users ADD COLUMN flat_no VARCHAR(50);",
            "ALTER TABLE users ADD COLUMN street_name VARCHAR(150);",
            "ALTER TABLE users ADD COLUMN area_name VARCHAR(150);",
            "ALTER TABLE users ADD COLUMN place VARCHAR(100);",
            "ALTER TABLE users ADD COLUMN district VARCHAR(100);",
            "ALTER TABLE users ADD COLUMN state VARCHAR(100);",
            "ALTER TABLE users ADD COLUMN pincode VARCHAR(20);"
        ]
        for query in queries:
            try:
                db.session.execute(text(query))
                db.session.commit()
                print(f"Executed: {query}")
            except Exception as e:
                db.session.rollback()
                print(f"Skipped (likely already exists): {query}")

if __name__ == '__main__':
    migrate()
