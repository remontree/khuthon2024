import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Device = styled.div`
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 20px;
  font-size: 25px;
  font-weight: bold;
  flex: 1; /* 동일한 너비를 가지도록 합니다. */
`;

const ConnectSubtitle = styled.div`
  display: flex;
  align-items: center; /* 요소들을 수직 정렬합니다. */
`;

const DeviceListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: -25px;
`;

const AddButton = styled.button`
  font-size: 30px;
  font-weight: bold;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;
  margin-left: auto; /* 왼쪽 여백을 최대한 확보합니다. */
  margin-right: 20px; /* 오른쪽 여백을 줄입니다. */
  top: 20px;
  right: 15px; /* 오른쪽 여백을 조절합니다. */
  background-color: #3a426b;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 12px;
  border: none;
  margin-top: 130px;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: none;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  height: 350px;
  width: 250px;
  text-overflow: ellipsis;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은색 배경 */
  z-index: 9998; /* 팝업보다 한 단계 아래 */
`;

const Container = styled.div`
  height: 200px;
`;

const ConnectedDevice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: 250px;
  height: 100px;
  margin-top: 30px;
  margin-left: 21px;
`;

const DeviceConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  // const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);
  const [connectable, setConnectable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDevices = sessionStorage.getItem("devices");
    if (storedDevices) {
      // string으로 변환하여 읽기
      setDevices(JSON.parse(storedDevices));
    }
  }, []);

  const togglePopup = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/show_connectable",
      responseType: "json",
    })
      .then((response) => {
        console.log(response.data);
        setConnectable(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(total_power_usage_update, 1000);
      });
    setShowPopup(!showPopup);
  };

  const handleCreateDevice = (deviceName) => {
    const updatedDevices = [...devices, deviceName];
    setDevices(updatedDevices);
    sessionStorage.setItem("devices", JSON.stringify(updatedDevices));
    navigate({ state: deviceName }); // 이동 시에 디바이스 이름 전달
  };

  const ConnectWhat = (content) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {content}
        </div>
        <button
          style={{
            marginLeft: "40px",
            marginBottom: "5px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => {
            axios({
              method: "get",
              url:
                "http://127.0.0.1:5000/device_connect_button/" +
                encodeURIComponent(content),
              responseType: "json",
            });
            handleCreateDevice(content); // 선택한 항목의 내용으로 디바이스 생성
          }}
        >
          연결
        </button>
      </div>
    );
  };

  const ConnectWhatList = (num, contentArray) => {
    const connectWhatList = [];
    for (let i = 0; i < num; i++) {
      connectWhatList.push(ConnectWhat(contentArray[i]));
    }
    return connectWhatList;
  };

  return (
    <>
      <ConnectSubtitle>
        <Device>Device List</Device>
        <AddButton onClick={togglePopup}>+</AddButton>
      </ConnectSubtitle>
      <DeviceListContainer>
        {showPopup && (
          <>
            <Backdrop onClick={togglePopup} />
            <Popup>
              <Container>
                <p>연결 가능한 디바이스</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {ConnectWhatList(connectable.length, connectable)}
                </div>
              </Container>
              <CloseButton onClick={togglePopup}>닫기</CloseButton>
            </Popup>
          </>
        )}
        {devices.map((device, index) => (
          <ConnectedDevice
            key={index}
            onClick={() => navigate(`/Device-Connect/${device}`)}
          >
            {device}
          </ConnectedDevice>
        ))}
      </DeviceListContainer>
    </>
  );
};

export default DeviceConnect;
