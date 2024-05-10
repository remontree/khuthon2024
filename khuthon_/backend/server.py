import socket
import threading
from device import Device  # Device 클래스는 클라이언트의 정보를 저장하는 용도로 사용되는 것으로 가정합니다
import time

class Server:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.client_sockets = {}
        self.prepare_sockets = {}
        self.test = 0

    def show_connectable(self):
        print(self.prepare_sockets)
        print(self.test)
        return list(self.prepare_sockets.keys())
    

    def handle_client(self, conn, addr):
        self.test = 100
        print(f"클라이언트 {addr}가 연결되었습니다!!")
        self.prepare_sockets[addr[1]] = conn

    def connect_device(self, port):
        print("pre: ", end='')
        print(self.prepare_sockets)

        print("client: ", end='')
        print(self.client_sockets)
        self.client_sockets[int(port)] = self.prepare_sockets[int(port)]
        # 클라이언트를 Device 클래스의 객체로 만들어서 device_name_list와 device_list에 추가
        device_name = f"{port}"  # 클라이언트의 포트 번호를 기반으로 디바이스 이름 생성
        device_port = port  # 클라이언트의 포트 번호를 저장
        Device(device_name, device_port)  # 수정된 부분

    def request_data_periodically(self):
        data_dict = {}
        for addr, conn in self.client_sockets.items():
            try:
                conn.sendall("요청 데이터".encode())
                data = int(conn.recv(1024).decode())
                print(f"클라이언트 {addr}로부터 받은 데이터: {data}")
                conn.sendall("데이터를 성공적으로 받았습니다.".encode())
                data_dict[addr] = data
            except ConnectionResetError:
                print(f"클라이언트 {addr}와의 연결이 끊겼습니다.")
                del self.client_sockets[addr]
        return data_dict

    def start(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((self.host, self.port))
            s.listen()

            print("서버가 클라이언트를 기다리고 있습니다...")
            
            while True:
                conn, addr = s.accept()
                self.handle_client(conn,addr)
                
            
