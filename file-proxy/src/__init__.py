import os
from flask import Flask
from waitress import serve

app = Flask(__name__)
curdir = os.path.abspath(os.path.dirname(__file__))

from src.config import Config
import src.main

def run_app():
    app.run(host=Config.APP_HOST, port=Config.APP_PORT, debug=Config.APP_DEBUG)
    # serve(app, host=Config.APP_HOST, port=Config.APP_PORT)
