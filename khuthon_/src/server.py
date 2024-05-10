from flask import Flask, jsonify
import json
from time import time
from random import random
from flask import Flask, render_template, make_response
from flask_cors import CORS

from device import Device

for i in range(1):
    Device("{}번째 디바이스".format(i), i)


app = Flask(__name__)
CORS(app)

@app.route('/')
def Home():
    users = ["hyper-personality energy monitoring"]
    return jsonify(users)


@app.route('/run_flask_function', methods=['POST'])
def run_flask_function():
    # 플라스크 함수 실행 코드
    # 이 부분에 플라스크 함수의 실제 내용을 작성합니다.
    print("hello")
    # 예시로 "Flask function executed" 메시지를 반환합니다.
    return jsonify({"message": "Flask function executed"})


time_cnt = 0

@app.route('/live-data')
def live_data():
    global time_cnt
    # Create a PHP array and echo it as JSON
    update_data = []
    for i in range(len(Device.device_list)):
        random_data = random()%1000
        update_data.append(Device.device_list[i].update(time_cnt, random_data))
    time_cnt+=1
    update_data.append(Device.maxDevice)
    #print(update_data)
    response = make_response(json.dumps(update_data))
    response.content_type = 'application/json'
    print("hello")
    return response

@app.route('/main_chart')
def main_chart():
    a = random()%1000
    print("whsdjfhasdklfjhsdlkfjasdhfkljasdhfklhlsdkfhasdklfjasdhjklf")
    response = make_response(json.dumps(a))
    return response


if __name__ == '__main__':
    app.run(debug=True)
