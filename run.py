from flask import Flask
from flask_jwt import JWT
from auth.security import *

def create_app(config_filename):
    app = Flask(__name__)
    app.config .from_object('common.settings')
    
    from app import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app


if __name__ == "__main__":
    app = create_app("config")
    app.run(host='0.0.0.0', port=5001, debug=True)
