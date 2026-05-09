import sys
sys.path.append(r'c:\Users\Yuvaraj\Documents\Hari 3D Printer\backend')

from app import create_app, db
from sqlalchemy import text, inspect

app = create_app()
with app.app_context():
    inspector = inspect(db.engine)
    columns = [col['name'] for col in inspector.get_columns('orders')]
    
    if 'quantity' in columns:
        print("quantity column already exists in orders table.")
    else:
        db.session.execute(text("ALTER TABLE orders ADD COLUMN quantity INTEGER DEFAULT 1"))
        db.session.commit()
        print("Added quantity column to orders table successfully.")
    
    if 'stock_count' in [col['name'] for col in inspector.get_columns('products')]:
        print("stock_count column exists in products table.")
    else:
        print("WARNING: stock_count column missing from products table!")
