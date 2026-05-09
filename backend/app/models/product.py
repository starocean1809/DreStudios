from app import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    images = db.Column(db.JSON) # List of image URLs
    featured = db.Column(db.Boolean, default=False)
    stock_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            'images': self.images,
            'featured': self.featured,
            'stock_count': self.stock_count
        }
