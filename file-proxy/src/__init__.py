import os
from flask import Flask
from waitress import serve

app = Flask(__name__)
curdir = os.path.abspath(os.path.dirname(__file__))

import src.config
import src.main

def run_app():
    serve(app, host="0.0.0.0", port=9090)
    
