import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Device = styled.div`
  border-top: 3px solid black;
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 20px;
  font-size: 25px;
  font-weight: bold;
`;

const DeviceListContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const AddButton = styled.button`
  font-size: 50px;
  font-weight: bold;
  border: none;
  width: 120px;
  height: 100px;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 3px;
  margin-right: auto;
  top: 20px;
  left: 15px;
  background-color: #3a426b;
  color: white;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 12px;
  border: none;
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
  border: 2px solid black;
  width: 120px;
  height: 100px;
  margin-top: 20px;
  margin-left: 21px;
`;

const DeviceConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const storedDevices = localStorage.getItem("devices");
    if (storedDevices) {
      // string으로 변환하여 읽기
      setDevices(JSON.parse(storedDevices));
    }
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleInputChange = (event) => {
    setDeviceName(event.target.value);
  };

  const handleCreateDevice = () => {
    const updatedDevices = [...devices, deviceName];
    setDevices(updatedDevices);
    localStorage.setItem("devices", JSON.stringify(updatedDevices));
    setDeviceName("");
    togglePopup();

    history({ state: deviceName });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCreateDevice();
    }
  };

  return (
    <>
      <Device>Device List</Device>
      <DeviceListContainer>
        <AddButton onClick={togglePopup}>+</AddButton>
        {showPopup && (
          <>
            <Backdrop onClick={togglePopup} />
            <Popup>
              <Container>
                <p>연결 가능한 디바이스</p>

                <input
                  type="text"
                  value={deviceName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="디바이스 이름"
                  autoFocus
                />
                {/* 만약 연결이 되면 팝업창이 닫힘. */}
                <button onClick={handleCreateDevice}>연결!</button>
              </Container>
              <CloseButton onClick={togglePopup}>닫기</CloseButton>
            </Popup>
          </>
        )}
      </DeviceListContainer>
      {devices.map((device, index) => (
        <ConnectedDevice key={index}>{device}</ConnectedDevice>
      ))}
    </>
  );
};

export default DeviceConnect;
