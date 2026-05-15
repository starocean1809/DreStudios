from app import db

class Setting(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))

    @staticmethod
    def get_value(key, default=None):
        setting = Setting.query.filter_by(key=key).first()
        return setting.value if setting else default

    @staticmethod
    def set_value(key, value, description=None):
        setting = Setting.query.filter_by(key=key).first()
        if setting:
            setting.value = str(value)
            if description:
                setting.description = description
        else:
            setting = Setting(key=key, value=str(value), description=description)
            db.session.add(setting)
        db.session.commit()
        return setting

    def to_dict(self):
        return {
            'key': self.key,
            'value': self.value,
            'description': self.description
        }
