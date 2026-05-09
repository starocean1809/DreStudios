from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app import db

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('phone') or not data.get('password'):
        return jsonify({'msg': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'Email already registered'}), 400
        
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'msg': 'Phone number already registered'}), 400

    user = User(
        email=data['email'],
        phone=data['phone'],
        is_admin=data.get('is_admin', False)
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'msg': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'msg': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'msg': 'Invalid email or password'}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not user:
        return jsonify({'msg': 'User not found'}), 404
        
    if 'email' in data:
        # Check if email is already taken by another user
        existing = User.query.filter_by(email=data['email']).first()
        if existing and str(existing.id) != user_id:
            return jsonify({'msg': 'Email already in use'}), 400
        user.email = data['email']
        
    if 'phone' in data:
        existing = User.query.filter_by(phone=data['phone']).first()
        if existing and str(existing.id) != user_id:
            return jsonify({'msg': 'Phone number already in use'}), 400
        user.phone = data['phone']
        
    if 'address' in data:
        user.address = data['address']
    if 'city' in data:
        user.city = data['city']
    if 'zip_code' in data:
        user.zip_code = data['zip_code']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
        
    db.session.commit()
    return jsonify(user.to_dict()), 200
