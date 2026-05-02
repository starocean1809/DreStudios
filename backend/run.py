from app import create_app, db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderMilestone

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
    app.run(debug=True, port=5000)
