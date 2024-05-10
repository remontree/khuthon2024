from flask import Flask, jsonify
import json
from time import time
from random import random
from flask import Flask, render_template, make_response
from flask_cors import CORS
import threading
from device import Device

import server

for i in range(1):
    Device("{}번째 디바이스".format(i), i)




app = Flask(__name__)
CORS(app)

conn_addr = ("localhost",2059)
device_server = server.Server(conn_addr[0],conn_addr[1])
device_server_start_thread = threading.Thread(target=device_server.start)
device_server_start_thread.start()

@app.route('/')
def Home():
    users = ["hyper-personality energy monitoring"]
    return jsonify(users)


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
    return response

time_cnt = 0

@app.route('/main_chart')
def main_chart():
    global time_cnt
    global device_server
    toupdate = device_server.request_data_periodically()
    for addr, conn in toupdate.items():
        for i in range(len(Device.device_name_list)):
            if Device.device_name_list[i] == str(addr):
                Device.device_list[i].update(time_cnt, conn)
    Device.ClassUpdate()
    time_cnt+=1
    main_data = [Device.PowerUsage(), Device.PowerUsageAvgPerTime(), int(Device.CalElectricBills()%50000), Device.UsageMaxDevice(), Device.AllUsage()]
    print(main_data)
    response = make_response(json.dumps(main_data))
    return response

@app.route('/show_connectable')
def show_connectable():
    global device_server
    response = device_server.show_connectable()
    response = make_response(json.dumps(response))
    return response

@app.route('/deviceupdate/<Name>')
def deviceupdate(Name):
    for i in range(len(Device.device_list)):
        if Device.device_list[i].name == Name:
            response = [sum(Device.device_list[i].power),Device.device_list[i].EachPowerUsageAvgPerTime(), [Device.PowerUsage(),sum(Device.device_list[i].power)], 
                        [Device.device_list[i].name, sum(Device.device_list[i].power), Device.device_list[i].PowerUsageAvg(), Device.device_list[i].UsageMaxTime(),Device.device_list[i].UsageMinTime()], Device.device_list[i].EnergyGrades()]
            break
    response = make_response(json.dumps(response))
    return response



@app.route('/device_connect_button/<Name>')
def device_connect_btn(Name):
    device_server.connect_device(Name)
    print("success")
    response = make_response(json.dumps([1,2,3]))
    return response

if __name__ == '__main__':
    app.run(debug=True)
