from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.cart import CartItem
from app.models.product import Product
from app import db

bp = Blueprint('cart', __name__, url_prefix='/api/cart')

@bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([i.to_dict() for i in items]), 200

@bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    product_id = int(data.get('product_id'))
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"msg": "Product ID required"}), 400

    # Check if item exists in cart
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(item)
    
    db.session.commit()
    return jsonify(item.to_dict()), 201

@bp.route('/<int:item_id>', methods=['PATCH'])
@jwt_required()
def update_item(item_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    quantity = data.get('quantity')
    
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first_or_404()
    if quantity is not None:
        if quantity <= 0:
            db.session.delete(item)
        else:
            item.quantity = quantity
            
    db.session.commit()
    return jsonify(item.to_dict()), 200

@bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_item(item_id):
    user_id = int(get_jwt_identity())
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Item removed"}), 200

@bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = int(get_jwt_identity())
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"msg": "Cart cleared"}), 200
