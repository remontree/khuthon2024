import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainIcon from "../images/Main-Icon.png";
import DeviceConnectIcon from "../images/Device-Connect-Icon.png";
import DeviceManagementIcon from "../images/Device-Management-Icon.png";

const NavDisplay = styled.div`
  width: 180px;
  height: 100vh;
  background-color: rgb(36, 38, 48);
  color: white;
  margin-left: 0;
  padding-top: 30px;
`;

const TeamName = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 200px;
`;

const Cursor = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 18px;
  font-size: 15px;
  cursor: pointer;
  white-space: pre;
  color: inherit;
  padding-bottom: 28px;

  &:hover {
    font-weight: semibold;
    background-color: #444cf8;
    border-radius: 5px;
  }
`;

const PageList = [
  { url: "/", text: "Main", icon: MainIcon },
  { url: "/Device-Connect", text: "디바이스 연결", icon: DeviceConnectIcon },
  {
    url: "/Device-Management",
    text: "비효율 장치 관리",
    icon: DeviceManagementIcon,
  },
];

const NavigationBar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("/");

  const goToPage = (url, text) => {
    navigate(url);
    setActiveItem(text);
  };
  return (
    <NavDisplay>
      <TeamName>한늦대눈멎</TeamName>
      {PageList.map((link) => (
        <Cursor
          key={link.url}
          onClick={() => goToPage(link.url, link.text)}
          active={activeItem === link.text}
        >
          <img
            src={link.icon}
            style={{
              marginRight: "8px",
              width: "17px",
              height: "18px",
            }}
          />
          {link.text}
        </Cursor>
      ))}
    </NavDisplay>
  );
};

export default NavigationBar;
