from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin


DB_URI = "mysql+mysqlconnector://root:Moskit2805@localhost/lab5db_web"

app = Flask(__name__)
CORS(app, support_credentials=True)


app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    max_speed = db.Column(db.Integer)
    millage = db.Column(db.Integer)

    def __init__(self, name, max_speed, millage):
        self.name = name
        self.max_speed = max_speed
        self.millage = millage


class CarSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'max_speed', 'millage')


car_schema = CarSchema()
cars_schema = CarSchema(many=True)


@app.route('/car', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_car():
    name = request.json['name']
    max_speed = request.json['max_speed']
    millage = request.json['millage']

    new_car = Car(name, max_speed, millage)

    db.session.add(new_car)
    db.session.commit()
    return car_schema.jsonify(new_car)


@app.route('/car', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_cars():
    all_cars = Car.query.all()
    result = cars_schema.dump(all_cars)
    return jsonify(result)


@app.route('/car/<id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_car(id):
    product = Car.query.get(id)
    if product is None:
        abort(404)
    return car_schema.jsonify(product)


@app.route('/car/<id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_car(id):
    car = Car.query.get(id)
    print(car)
    if car is None:
        abort(404)

    name = request.json['name']
    max_speed = request.json['max_speed']
    millage = request.json['millage']

    car.name = name
    car.max_speed = max_speed
    car.millage = millage

    db.session.commit()
    return car_schema.jsonify(car)


@app.route('/car/<id>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def delete_car(id):
    car = Car.query.get(id)
    if car is None:
        abort(404)
    db.session.delete(car)
    db.session.commit()
    return car_schema.jsonify(car)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)
