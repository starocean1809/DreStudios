from app import create_app, db
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderMilestone
from app.models.cart import CartItem

def seed():
    app = create_app()
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if products exist
        if Product.query.first():
            print("Database already seeded.")
            return

        print("Seeding database...")
        
        # Add products
        products = [
            {
                'title': 'Geometric Art Vase',
                'category': 'Art',
                'price': 24.99,
                'description': 'A beautiful geometric art vase, 3D printed with precision.',
                'images': ['https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80'],
                'featured': True
            },
            {
                'title': 'Solar System Model',
                'category': 'Education',
                'price': 39.99,
                'description': 'Detailed 3D printed solar system model.',
                'images': ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80'],
                'featured': False
            },
            {
                'title': 'Articulating Dragon',
                'category': 'Art',
                'price': 29.99,
                'description': 'Fully articulating dragon figurine.',
                'images': ['https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=600&q=80'],
                'featured': True
            }
        ]
        
        for p_data in products:
            p = Product(**p_data)
            db.session.add(p)
            
        # Create a default admin
        if not User.query.filter_by(email='admin@example.com').first():
            admin = User(
                email='admin@example.com',
                phone='1234567890',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            print("Admin user created: admin@example.com / admin123")
            
        db.session.commit()
        print("Success!")

if __name__ == '__main__':
    seed()
