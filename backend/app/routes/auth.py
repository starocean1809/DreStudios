from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
from app.models.user import User
from app.models.otp import OtpVerification
from app import db
from app.utils.email import send_otp_email, send_password_reset_email
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from datetime import datetime, timedelta
import random

bp = Blueprint('auth', __name__)

@bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'msg': 'Email is required'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 400
        
    otp = str(random.randint(100000, 999999))
    
    # Delete any existing OTP records for this email
    OtpVerification.query.filter_by(email=email).delete()
    
    # Save new OTP to database with 10 min expiry
    otp_record = OtpVerification(
        email=email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        verified=False
    )
    db.session.add(otp_record)
    db.session.commit()
    
    try:
        if send_otp_email(email, otp):
            return jsonify({'msg': 'OTP sent successfully'}), 200
        else:
            # This happens if send_otp_email returns False (e.g. SMTP issue)
            return jsonify({'msg': 'Failed to send OTP email. Please check server logs.'}), 500
    except Exception as e:
        # Rollback OTP if something crashes
        db.session.delete(otp_record)
        db.session.commit()
        return jsonify({'msg': 'Internal Server Error', 'error': str(e)}), 500

@bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'msg': 'Email and OTP are required'}), 400
        
    record = OtpVerification.query.filter_by(email=email).order_by(OtpVerification.created_at.desc()).first()
    if not record:
        return jsonify({'msg': 'No OTP requested for this email'}), 400
        
    if record.is_expired():
        db.session.delete(record)
        db.session.commit()
        return jsonify({'msg': 'OTP has expired. Please request a new one.'}), 400
        
    if record.otp != otp:
        return jsonify({'msg': 'Invalid OTP'}), 400
        
    record.verified = True
    db.session.commit()

    return jsonify({'msg': 'OTP verified successfully'}), 200

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('phone') or not data.get('password'):
        return jsonify({'msg': 'Missing required fields'}), 400
        
    email = data['email']
    
    # Check if email was verified via DB
    record = OtpVerification.query.filter_by(email=email).order_by(OtpVerification.created_at.desc()).first()
    if not record or not record.verified:
        return jsonify({'msg': 'Email not verified. Please verify OTP first.'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 400
        
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'msg': 'Phone number already registered'}), 400

    user = User(
        name=data.get('name'),
        email=email,
        phone=data['phone'],
        flat_no=data.get('flat_no'),
        street_name=data.get('street_name'),
        area_name=data.get('area_name'),
        place=data.get('place'),
        district=data.get('district'),
        state=data.get('state'),
        pincode=data.get('pincode'),
        is_admin=data.get('is_admin', False)
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Delete the OTP record from the database after successful registration
    OtpVerification.query.filter_by(email=email).delete()
    db.session.commit()
    
    return jsonify({'msg': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    identifier = data.get('email') or data.get('identifier')
    password = data.get('password')
    
    if not data or not identifier or not password:
        return jsonify({'msg': 'Missing email/phone or password'}), 400
        
    user = User.query.filter((User.email == identifier) | (User.phone == identifier)).first()
    
    if not user or not user.check_password(password):
        return jsonify({'msg': 'Invalid credentials'}), 401
        
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token}), 200

@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'msg': 'Email is required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        # Return success even if user not found to prevent email enumeration
        return jsonify({'msg': 'If an account with that email exists, a reset link has been sent.'}), 200
        
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps(email, salt='password-reset-salt')
    
    # Normally read from an environment variable for the frontend URL
    frontend_url = 'http://localhost:5173'
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    if send_password_reset_email(email, reset_link):
        return jsonify({'msg': 'If an account with that email exists, a reset link has been sent.'}), 200
    else:
        return jsonify({'msg': 'Failed to send reset email'}), 500

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    
    if not token or not new_password:
        return jsonify({'msg': 'Token and new password are required'}), 400
        
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=900) # 15 minutes validity
    except SignatureExpired:
        return jsonify({'msg': 'The password reset link has expired.'}), 400
    except BadSignature:
        return jsonify({'msg': 'Invalid password reset link.'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'User not found.'}), 404
        
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'msg': 'Password has been reset successfully.'}), 200

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
        
    if 'name' in data:
        user.name = data['name']
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
        
    if 'flat_no' in data:
        user.flat_no = data['flat_no']
    if 'street_name' in data:
        user.street_name = data['street_name']
    if 'area_name' in data:
        user.area_name = data['area_name']
    if 'place' in data:
        user.place = data['place']
    if 'district' in data:
        user.district = data['district']
    if 'state' in data:
        user.state = data['state']
    if 'pincode' in data:
        user.pincode = data['pincode']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
        
    db.session.commit()
    return jsonify(user.to_dict()), 200
