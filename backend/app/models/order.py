from datetime import datetime
from app import db
import uuid

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), unique=True, nullable=False) # Human readable: ORD-YYYYMMDD-XXXX
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Financial fields
    subtotal = db.Column(db.Float, default=0.0)
    gst_amount = db.Column(db.Float, default=0.0)
    shipping_amount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, default=0.0)
    
    # Status fields
    status = db.Column(db.String(50), default='PENDING_PAYMENT') # PENDING_PAYMENT, PAYMENT_SUCCESS, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    payment_status = db.Column(db.String(50), default='pending')
    payment_reference = db.Column(db.String(100))
    
    # Shipping info
    shipping_address = db.Column(db.String(500))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    phone = db.Column(db.String(20))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    milestones = db.relationship('OrderMilestone', backref='order', order_by='OrderMilestone.id', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'user_id': self.user_id,
            'user': {
                'email': self.customer.email,
                'name': self.customer.name if self.customer.name else self.customer.email
            } if self.customer else None,
            'subtotal': self.subtotal,
            'gst_amount': self.gst_amount,
            'shipping_amount': self.shipping_amount,
            'total_amount': self.total_amount,
            'status': self.status,
            'payment_status': self.payment_status,
            'payment_reference': self.payment_reference,
            'shipping_address': self.shipping_address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'phone': self.phone,
            'created_at': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items],
            'milestones': sorted([m.to_dict() for m in self.milestones], key=lambda x: x['id'])
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False) # Price at time of purchase
    total = db.Column(db.Float, nullable=False) # quantity * price
    
    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'price': self.price,
            'total': self.total
        }

class OrderMilestone(db.Model):
    __tablename__ = 'order_milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    label = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    step_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'label': self.label,
            'description': self.description,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'step_order': self.step_order
        }
