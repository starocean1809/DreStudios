from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.setting import Setting
from app.models.user import User
from app import db

bp = Blueprint('settings', __name__)

@bp.route('', methods=['GET'])
def get_settings():
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings}), 200

@bp.route('', methods=['POST'])
@jwt_required()
def update_settings():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'msg': 'Admin access required'}), 403
            
        data = request.get_json()
        if not data:
            return jsonify({'msg': 'No data provided'}), 400

        for key, value in data.items():
            Setting.set_value(key, value)
            
        return jsonify({'msg': 'Settings updated successfully'}), 200
    except Exception as e:
        print(f"Settings Update Error: {str(e)}")
        return jsonify({'msg': 'Internal Server Error', 'error': str(e)}), 500

@bp.route('/init', methods=['GET'])
def init_settings():
    # Ensure table exists
    db.create_all()
    
    # Initialize default settings if they don't exist
    defaults = {
        'gst_rate': '18',
        'shipping_fee': '250'
    }
    for k, v in defaults.items():
        if not Setting.query.filter_by(key=k).first():
            Setting.set_value(k, v)
    return jsonify({'msg': 'Default settings initialized'}), 200
