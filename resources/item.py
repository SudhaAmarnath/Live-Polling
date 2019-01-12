from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from auth.security import *
from resources.user import UserRegister, UserTenancy
import common.settings
from common.logging_module import get_logger

items = []


class Item(Resource):
   parser = reqparse.RequestParser()
   parser.add_argument('price',
      type=float,
      required=True,
      help="This field cannot be left blank"
   )

   @cross_origin(headers=['Content-Type', 'Authorization'])
   @requires_auth
   def get(self,name):
       item = next(filter(lambda x: x['name'] == name, items), None)
       return {'item': item}, 200 if item else 404

   def post(self,name):
       if next(filter(lambda x: x['name'] == name, items), None):
          return {'message': "An Item with name '{}' already exist.".format(name)}, 400
       data = Item.parser.parse_args()
       item = {'name': name, 'price': data['price']}
       items.append(item)
       return item, 201

   def delete(self,name):
       global items
       items = list(filter(lambda x: x['name'] != name, items))
       return {'message': 'Item Deleted'}

   def put(self,name):
       data = Item.parser.parse_args()
       item = next(filter(lambda x: x['name'] == name, items), None)
       if item is None:
           item = {'name': name, 'Price': data['price']}
           items.append(item)
       else:
           item.update(data)
       return item

class ItemList(Resource):
   @requires_auth
   def get(self):
       return{'Items': items}

