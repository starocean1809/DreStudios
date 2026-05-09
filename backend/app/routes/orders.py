from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order, OrderMilestone
from app.models.user import User
from app import db
from datetime import datetime

bp = Blueprint('orders', __name__)

@bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    product_id = int(data['product_id'])
    quantity = int(data.get('quantity', 1))
    
    from app.models.product import Product
    product = Product.query.get_or_404(product_id)
    
    if product.stock_count < quantity:
        return jsonify({'msg': f'Insufficient stock. Only {product.stock_count} units left.'}), 400
        
    order = Order(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity,
        shipping_address=data.get('shipping_address'),
        city=data.get('city'),
        zip_code=data.get('zip_code')
    )
    product.stock_count -= quantity
    db.session.add(order)
    db.session.flush() # Get order ID
    
    # Initialize milestones
    milestones = [
        ('Received', 'Order has been received'),
        ('Preparing', 'Preparing files for 3D printing'),
        ('Printing', 'Product is currently on the print bed'),
        ('Quality Check', 'Verifying print quality and finishing'),
        ('Shipped', 'Order handed over to courier')
    ]
    
    for idx, (label, desc) in enumerate(milestones):
        m = OrderMilestone(
            order_id=order.id,
            label=label,
            description=desc,
            completed=(label == 'Received'), # First one done
            completed_at=datetime.utcnow() if label == 'Received' else None,
            step_order=idx
        )
        db.session.add(m)
        
    db.session.commit()
    return jsonify(order.to_dict()), 201

@bp.route('', methods=['GET'])
@jwt_required()
def list_orders():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if user.is_admin:
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=user_id).all()
        
    return jsonify([o.to_dict() for o in orders]), 200

@bp.route('/<int:id>/milestone/<int:m_id>', methods=['PUT'])
@jwt_required()
def update_milestone(id, m_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user.is_admin:
        return jsonify({'msg': 'Admin access required'}), 403
        
    milestone = OrderMilestone.query.filter_by(order_id=id, id=m_id).first_or_404()
    data = request.get_json()
    
    milestone.completed = data.get('completed', milestone.completed)
    milestone.label = data.get('label', milestone.label)
    milestone.description = data.get('description', milestone.description)
    
    if milestone.completed and not milestone.completed_at:
        milestone.completed_at = datetime.utcnow()
    elif not milestone.completed:
        milestone.completed_at = None
        
    # Cascade completion to previous milestones if this one is being completed
    order = Order.query.get(id)
    if milestone.completed:
        current_step = milestone.step_order
        for m in order.milestones:
            if m.step_order < current_step and not m.completed:
                m.completed = True
                m.completed_at = milestone.completed_at
    
    db.session.flush() # Force save so the query below sees the changes
        
    # Update order status based on completed milestones
    order = Order.query.get(id)
    milestones = order.milestones.all()
    completed_labels = [m.label for m in milestones if m.completed]
    
    if all(m.completed for m in milestones):
        order.status = 'completed'
    elif 'Shipped' in completed_labels:
        order.status = 'shipped'
    elif 'Printing' in completed_labels:
        order.status = 'printing'
    elif 'Preparing' in completed_labels:
        order.status = 'preparing'
    elif 'Received' in completed_labels:
        order.status = 'pending'
        
    db.session.commit()
    return jsonify(milestone.to_dict()), 200

@bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user.is_admin:
        return jsonify({'msg': 'Admin access required'}), 403
        
    order = Order.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status', order.status)
    order.status = new_status
    
    # Cascade milestone completion based on status change
    target_steps = 0
    if new_status == 'pending': target_steps = 1
    elif new_status == 'preparing': target_steps = 2
    elif new_status == 'printing': target_steps = 3
    elif new_status == 'shipped': target_steps = 5
    elif new_status == 'completed': target_steps = 5
    
    sorted_milestones = sorted(order.milestones, key=lambda x: x.id)
    for idx, m in enumerate(sorted_milestones):
        step = m.step_order if m.step_order else idx
        if step < target_steps:
            m.completed = True
            if not m.completed_at:
                m.completed_at = datetime.utcnow()
        else:
            m.completed = False
            m.completed_at = None
            
    db.session.commit()
    return jsonify(order.to_dict()), 200
