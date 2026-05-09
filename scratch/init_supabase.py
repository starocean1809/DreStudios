import sys
sys.path.append(r'c:\Users\Yuvaraj\Documents\Hari 3D Printer\backend')

from app import create_app, db

app = create_app()
with app.app_context():
    print("Connecting to Supabase PostgreSQL...")
    try:
        db.create_all()
        print("All tables created successfully in Supabase!")
        
        # List tables created
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print("Tables in database:", tables)
    except Exception as e:
        print(f"Error: {e}")
