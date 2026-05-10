from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    from app.models.user import User
    from app.models.product import Product
    from app.models.order import Order, OrderMilestone
    from app.models.cart import CartItem
    from app.models.review import Review
    from app.models.otp import OtpVerification

    from app.routes import auth, products, orders, cart, reviews, stats
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(products.bp, url_prefix='/api/products')
    app.register_blueprint(orders.bp, url_prefix='/api/orders')
    app.register_blueprint(cart.bp, url_prefix='/api/cart')
    app.register_blueprint(reviews.bp, url_prefix='/api/reviews')
    app.register_blueprint(stats.bp, url_prefix='/api/stats')

    return app
