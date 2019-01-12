from flask import Flask, Blueprint
from flask_restful import Resource, Api, reqparse
from flask_jwt import JWT
from auth.security import *
from resources.user import UserRegister, UserTenancy
import common.settings
from resources.item import Item,ItemList

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

#app.config .from_object('common.settings')
#app.secret_key = SECRET_KEY
#jwt = JWT(api, authenticate, identity)  # /auth

api.add_resource(Item, '/item/<string:name>')
api.add_resource(ItemList, '/items')
api.add_resource(UserRegister, '/usermgmt')
api.add_resource(UserTenancy, '/tenancy')

#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=5001, debug=True)
