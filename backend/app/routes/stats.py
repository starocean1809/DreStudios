from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app import db

bp = Blueprint('stats', __name__)

@bp.route('/overview', methods=['GET'])
@jwt_required()
def get_stats_overview():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({'msg': 'Unauthorized'}), 403

    total_users = User.query.count()
    total_products = Product.query.count()
    
    # Calculate total products ordered and total completed
    total_ordered = db.session.query(db.func.sum(Order.quantity)).scalar() or 0
    total_completed = db.session.query(db.func.sum(Order.quantity))\
                        .filter(Order.status.in_(['completed', 'shipped'])).scalar() or 0

    return jsonify({
        'total_users': total_users,
        'total_products': total_products,
        'total_ordered': int(total_ordered),
        'total_completed': int(total_completed)
    }), 200
