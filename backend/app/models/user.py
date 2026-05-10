from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Address details
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    
    # Detailed address components
    flat_no = db.Column(db.String(50))
    street_name = db.Column(db.String(150))
    area_name = db.Column(db.String(150))
    place = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    pincode = db.Column(db.String(20))

    profile_image = db.Column(db.Text)
    
    orders = db.relationship('Order', backref='customer', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'is_admin': self.is_admin,
            'address': self.address,
            'city': self.city,
            'zip_code': self.zip_code,
            'flat_no': self.flat_no,
            'street_name': self.street_name,
            'area_name': self.area_name,
            'place': self.place,
            'district': self.district,
            'state': self.state,
            'pincode': self.pincode,
            'profile_image': self.profile_image
        }
