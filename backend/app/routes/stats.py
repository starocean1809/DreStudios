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
    
    from app.models.order import OrderItem
    
    # Calculate total orders and total completed orders
    total_ordered = Order.query.count()
    total_completed = Order.query.filter(Order.status == 'DELIVERED').count()

    return jsonify({
        'total_users': total_users,
        'total_products': total_products,
        'total_ordered': total_ordered,
        'total_completed': total_completed
    }), 200

@bp.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoice_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({'msg': 'Unauthorized'}), 403

    from datetime import datetime
    import calendar
    
    # Get monthly summary for the current year
    current_year = datetime.utcnow().year
    monthly_data = []
    
    for month in range(1, 13):
        start_date = datetime(current_year, month, 1)
        _, last_day = calendar.monthrange(current_year, month)
        end_date = datetime(current_year, month, last_day, 23, 59, 59)
        
        from app.models.order import OrderItem
        month_orders = Order.query.filter(Order.created_at >= start_date, Order.created_at <= end_date).all()
        order_ids = [o.id for o in month_orders]
        total_products = db.session.query(db.func.sum(OrderItem.quantity)).filter(OrderItem.order_id.in_(order_ids)).scalar() or 0 if order_ids else 0
        
        total_invoices = len(month_orders)
        total_subtotal = sum(o.subtotal for o in month_orders)
        total_gst = sum(o.gst_amount for o in month_orders)
        total_shipping = sum(o.shipping_amount for o in month_orders)
        total_revenue = sum(o.total_amount for o in month_orders)
        
        monthly_data.append({
            'month': calendar.month_name[month],
            'month_idx': month,
            'total_invoices': total_invoices,
            'total_products': int(total_products),
            'total_subtotal': total_subtotal,
            'total_gst': total_gst,
            'total_shipping': total_shipping,
            'total_revenue': total_revenue
        })
        
    return jsonify({
        'year': current_year,
        'monthly_data': monthly_data,
        'totals': {
            'gst': sum(m['total_gst'] for m in monthly_data),
            'shipping': sum(m['total_shipping'] for m in monthly_data),
            'revenue': sum(m['total_revenue'] for m in monthly_data),
            'invoices': sum(m['total_invoices'] for m in monthly_data)
        }
    }), 200
