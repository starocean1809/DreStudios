from datetime import datetime
from app import db

class OrderMilestone(db.Model):
    __tablename__ = 'order_milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    label = db.Column(db.String(100), nullable=False) # e.g. "Received", "Printing"
    description = db.Column(db.String(256))
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'label': self.label,
            'description': self.description,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
