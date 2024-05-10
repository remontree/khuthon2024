import socket
import random
import threading
class Client:
    def __init__(self, host, port):
        self.host = host
        self.port = port

    def connect_to_server(self):
        # 서버에 연결
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.connect((self.host, self.port))

    def transmit_data(self):
        # 서버로부터 '요청 데이터'를 받으면 전압과 전류 값을 곱한 전력 값을 계산하여 서버로 보냄
        while True:
            data = self.s.recv(1024).decode()
            if data == '요청 데이터':
                voltage = 220  # 전압 값
                current = random.randint(1, 100)  # 1부터 100 사이의 난수로 전류 값 생성
                power = voltage * current  # 전력 값 계산
                self.s.sendall(str(power).encode())  # 전력 값을 문자열로 서버로 전송

    def close_connection(self):
        self.s.close()

def main():
    print("wiow")
    conn_addr = ("localhost",2059)
  
    client_list = []
    for i in range(10):
        client_list.append(Client(conn_addr[0], conn_addr[1]))
        client_list[-1].connect_to_server()
    client_thread_list = []
    for i in range(10):
        client_thread_list.append(threading.Thread(target=client_list[i].transmit_data))
        client_thread_list[-1].start()
    
    for i in range(10):
        client_thread_list[i].join()
    
main()