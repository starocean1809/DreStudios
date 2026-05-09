from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.product import Product
from app.models.user import User
from app import db

bp = Blueprint('products', __name__)

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'msg': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@bp.route('', methods=['GET'])
def list_products():
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query
    
    if category and category != 'All Products':
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(Product.title.ilike(f'%{search}%'))
        
    products = query.all()
    return jsonify([p.to_dict() for p in products]), 200

@bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict()), 200

@bp.route('', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    product = Product(
        title=data['title'],
        category=data['category'],
        price=data['price'],
        description=data.get('description'),
        images=data.get('images', []),
        featured=data.get('featured', False),
        stock_count=data.get('stock_count', 0)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@bp.route('/<int:id>', methods=['PUT'])
@admin_required
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    product.title = data.get('title', product.title)
    product.category = data.get('category', product.category)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.images = data.get('images', product.images)
    product.featured = data.get('featured', product.featured)
    product.stock_count = data.get('stock_count', product.stock_count)
    
    db.session.commit()
    return jsonify(product.to_dict()), 200

@bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'msg': 'Product deleted'}), 200
