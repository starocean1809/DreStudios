from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        print("Updating orders table...")
        # Add new columns to orders
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id VARCHAR(50)"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DOUBLE PRECISION DEFAULT 0.0"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS gst_amount DOUBLE PRECISION DEFAULT 0.0"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DOUBLE PRECISION DEFAULT 0.0"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DOUBLE PRECISION DEFAULT 0.0"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100)"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS state VARCHAR(100)"))
        db.session.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(20)"))
        
        # Create order_items table
        db.session.execute(text("""
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price DOUBLE PRECISION NOT NULL,
                total DOUBLE PRECISION NOT NULL
            )
        """))
        
        db.session.commit()
        print("Successfully updated orders schema and created order_items table")
        
        # Optional: Backfill order_id for existing orders
        orders = db.session.execute(text("SELECT id FROM orders WHERE order_id IS NULL")).fetchall()
        if orders:
            print(f"Backfilling {len(orders)} existing orders...")
            for row in orders:
                temp_id = f"ORD-OLD-{row[0]}"
                db.session.execute(text("UPDATE orders SET order_id = :oid WHERE id = :id"), {"oid": temp_id, "id": row[0]})
            db.session.commit()
            print("Backfill complete")

    except Exception as e:
        db.session.rollback()
        print(f"Error during migration: {e}")
