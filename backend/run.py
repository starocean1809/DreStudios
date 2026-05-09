from app import create_app, db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderMilestone
import os

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db, 
        'User': User, 
        'Product': Product, 
        'Order': Order, 
        'OrderMilestone': OrderMilestone
    }

if __name__ == '__main__':
    with app.app_context():
        try:
            db.session.execute(db.text('SELECT 1'))
            db_url = os.environ.get('DATABASE_URL', '')
            if 'supabase' in db_url:
                host = db_url.split('@')[-1].split('/')[0] if '@' in db_url else 'unknown'
                print("\n" + "="*55)
                print("  [OK] Supabase DB Connected Successfully!")
                print(f"  Host : {host}")
                print("="*55 + "\n")
            else:
                print("\n[OK] Database Connected Successfully!\n")
        except Exception as e:
            print(f"\n[ERROR] Database connection failed: {e}\n")

    app.run(debug=True, port=5000)
