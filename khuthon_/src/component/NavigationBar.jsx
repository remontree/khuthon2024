import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import MainIcon from "../images/Main-Icon.png";
import DeviceConnectIcon from "../images/Device-Connect-Icon.png";
import DeviceAnalysisIcon from "../images/Device-Analysis-Icon.png";
import Tree from "../images/Tree.png";

const NavDisplay = styled.div`
  width: 180px;
  height: 100vh;
  // background-color: rgb(36, 38, 48);
  background-color: #a9cd6c;
  color: white;
  margin-left: 0;
  padding-top: 30px;
  padding-left: 15px;
  padding-right: 15px;
`;

const TeamName = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 150px;
`;

const Cursor = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 15px;
  cursor: pointer;
  white-space: pre;
  color: inherit;
  height: 35px;
  box-sizing: border-box;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;

  ${({ active }) =>
    active &&
    css`
      background-color: #86c072;
      font-weight: bold;
    `}
`;

// const TextWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   padding-top: 20px;
// `;

const PageList = [
  { url: "/", text: "Main", icon: MainIcon },
  { url: "/Device-Connect", text: "디바이스 연결", icon: DeviceConnectIcon },
  {
    url: "/Device-Analysis",
    text: "전력 소모 분석",
    icon: DeviceAnalysisIcon,
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
      <TeamName>HNDNM</TeamName>
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
      <img
        src={Tree}
        style={{
          width: "140px",
          height: "150px",
          marginTop: "230px",
          marginLeft: "20px",
        }}
      />
    </NavDisplay>
  );
};

export default NavigationBar;
