from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order, OrderMilestone
from app.models.user import User
from app import db
from datetime import datetime
from app.utils.email import send_order_confirmation_email

bp = Blueprint('orders', __name__)

import random
import string

def generate_order_id():
    date_str = datetime.utcnow().strftime('%Y%m%d')
    rand_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{date_str}-{rand_str}"

@bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    items_data = data.get('items', [])
    if not items_data and 'product_id' in data:
        # Fallback for single product checkout
        items_data = [{
            'product_id': data['product_id'],
            'quantity': data.get('quantity', 1)
        }]
    
    if not items_data:
        return jsonify({'msg': 'No items in order'}), 400
        
    from app.models.product import Product
    from app.models.order import OrderItem
    
    # Calculate Subtotal and Verify Stock
    subtotal = 0.0
    order_items = []
    
    for item in items_data:
        product = Product.query.get_or_404(item['product_id'])
        qty = int(item['quantity'])
        
        if product.stock_count < qty:
            return jsonify({'msg': f'Insufficient stock for {product.title}. Only {product.stock_count} units left.'}), 400
            
        item_total = product.price * qty
        subtotal += item_total
        
        order_items.append({
            'product': product,
            'quantity': qty,
            'price': product.price,
            'total': item_total
        })
        
    # Calculate GST and Total using dynamic settings
    from app.models.setting import Setting
    gst_rate_val = float(Setting.get_value('gst_rate', '18')) / 100.0
    gst_amount = subtotal * gst_rate_val
    shipping_fee_val = float(Setting.get_value('shipping_fee', '250'))
    shipping_amount = data.get('shipping_amount', shipping_fee_val)
    total_amount = subtotal + gst_amount + shipping_amount
    
    order = Order(
        order_id=generate_order_id(),
        user_id=user_id,
        subtotal=subtotal,
        gst_amount=gst_amount,
        shipping_amount=shipping_amount,
        total_amount=total_amount,
        status='PAYMENT_SUCCESS', # As per user request to neglect payment for now, assume success
        payment_status='paid',
        shipping_address=data.get('shipping_address'),
        city=data.get('city'),
        state=data.get('state'),
        zip_code=data.get('zip_code'),
        phone=data.get('phone')
    )
    
    db.session.add(order)
    db.session.flush() # Get order ID
    
    # Create Order Items and Update Stock
    for item in order_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=item['product'].id,
            quantity=item['quantity'],
            price=item['price'],
            total=item['total']
        )
        item['product'].stock_count -= item['quantity']
        db.session.add(oi)
    
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
    
    # Send Confirmation Email
    user = User.query.get(user_id)
    if user and user.email:
        send_order_confirmation_email(user.email, order.to_dict())
        
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
        
    # Cascade completion logic
    order = Order.query.get(id)
    current_step = milestone.step_order
    
    if milestone.completed:
        # Forward Cascade: Complete all previous steps
        for m in order.milestones:
            if m.step_order < current_step and not m.completed:
                m.completed = True
                m.completed_at = milestone.completed_at
    else:
        # Backward Cascade: Un-complete all subsequent steps
        for m in order.milestones:
            if m.step_order > current_step and m.completed:
                m.completed = False
                m.completed_at = None
    
    db.session.flush() # Force save so the query below sees the changes
        
    # Update order status based on completed milestones
    order = Order.query.get(id)
    milestones = sorted(order.milestones.all(), key=lambda x: x.step_order)
    completed_milestones = [m for m in milestones if m.completed]
    
    if not completed_milestones:
        order.status = 'PENDING'
    elif all(m.completed for m in milestones):
        order.status = 'DELIVERED'
    else:
        # Set status to the label of the latest completed milestone
        order.status = completed_milestones[-1].label.upper()
        
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
    if new_status in ['PAYMENT_SUCCESS', 'RECEIVED']: target_steps = 1
    elif new_status == 'PREPARING': target_steps = 2
    elif new_status == 'PRINTING': target_steps = 3
    elif new_status == 'QUALITY CHECK': target_steps = 4
    elif new_status in ['SHIPPED', 'DELIVERED']: target_steps = 5
    
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
