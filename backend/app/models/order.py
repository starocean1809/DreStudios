from datetime import datetime
from app import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pending') # pending, printing, completed, shipped
    shipping_address = db.Column(db.String(500))
    city = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    
    product = db.relationship('Product', backref='ordered_in')
    milestones = db.relationship('OrderMilestone', backref='order', order_by='OrderMilestone.id', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': {
                'email': self.customer.email,
                'phone': self.customer.phone
            } if self.customer else None,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'created_at': self.created_at.isoformat(),
            'status': self.status,
            'shipping_address': self.shipping_address,
            'city': self.city,
            'zip_code': self.zip_code,
            'milestones': sorted([m.to_dict() for m in self.milestones], key=lambda x: x['id'])
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
