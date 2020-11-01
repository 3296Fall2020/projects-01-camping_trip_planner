from flask import Flask, jsonify, request
from flask_cors import CORS
from src import auth

# name = request.headers["name"]  # localhost:5000/login headers= {'name': 'someones name}
# name = request.args["name"]  # localhost:5000/login?name=sebastian

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def main_page():
    return "Camping Trip Planner Home"


@app.route('/home', methods=['GET'])
def home():
    return jsonify({'name': 'Sebastian Tota'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)  # Force body to be read as JSON
    email = data.get('email')
    password = data.get('password')
    g_recaptcha_response = data.get('recap_response')

    # Verify recaptcha is authenticated before checking password (prevent bot spamming)
    if not auth.verify_recaptcha(g_recaptcha_response):
        # Failed re-captcha verification
        return jsonify({'status': 401, 'error': 'failed-recaptcha'})

    # Authenticate users account and password
    if auth.verify_password(email, password):
        # Password is correct, return temporary session ID
        return jsonify({'status': 200, 'email': email, 'session_id': '123abc456def'})
    else:
        # Incorrect password specified, return Unauthorized Code
        return jsonify({'status': 401, 'error': 'incorrect-password'})


@app.route('/signup', methods=['POST'])
def signup():
    return ""


@app.route('/forgotPassword', methods=['POST'])
def forgot_password():
    return ""


if __name__ == '__main__':
    app.run()
