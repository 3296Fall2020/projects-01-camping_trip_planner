from flask import Flask
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)


@app.route('/home', methods=['GET'])
def home():
    return "This is the home"


@app.route('/login', methods=['POST'])
def login():
    return "This is the login"


if __name__ == '__main__':
    app.run()
