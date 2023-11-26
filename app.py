from flask import Flask, render_template, url_for, request
import pandas as pd
import json

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


def filter_cars(brand, fuel, color, gear, status):
    data = pd.read_csv("car_market.csv")

    if brand:
        data = data[data["Marka"] == brand]
    if fuel:
        data = data[data["Yakıt Turu"] == fuel]
    if color:
        data = data[data["Renk"] == color]
    if gear:
        data = data[data["Vites"] == gear]
    if status:
        data = data[data["Durum"] == status]

    return data


@app.route("/api/cars")
def cars():
    brand = request.args.get("marka")
    fuel = request.args.get("yakit")
    color = request.args.get("renk")
    gear = request.args.get("vites")
    status = request.args.get("durum")

    filtered_cars = filter_cars(brand, fuel, color, gear, status)
    json_data = filtered_cars.to_json(orient="records")

    # Return the JSON data
    return json_data
