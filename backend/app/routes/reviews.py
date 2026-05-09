from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app import db

bp = Blueprint('reviews', __name__)

@bp.route('/product/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews]), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    product_id = data.get('product_id')
    rating = data.get('rating')
    comment = data.get('comment')
    
    if not all([product_id, rating, comment]):
        return jsonify({'msg': 'Missing required fields'}), 400
        
    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201
