import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavigationBar from "./component/NavigationBar";
import Main from "./pages/Main";
import DeviceConnect from "./pages/DeviceConnect";
import DeviceManagement from "./pages/DeviceManagement";
import DeviceDetail from "./component/DeviceDetail";
import axios from "axios";

const AppWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

const App = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  const handleButtonClick = () => {
    axios
      .get("/live-data")
      .then((response) => {
        setData((prevData) => {
          // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
          const newData = response.data;
          //console.log(response.data);
          return newData;
        });
        setTimeout(handleButtonClick, 1000);
      })
      .catch((error) => {
        //console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        setData([1, 2, 3, 4, 5]);
        handleButtonClick();
      })
      .catch((error) => {
        //console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <BrowserRouter>
      <AppWrapper>
        <NavigationBar />
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Main main_Data={data} />}></Route>
            <Route path="/Device-Connect" element={<DeviceConnect />}></Route>
            <Route
              path="/Device-Connect/:deviceName"
              element={<DeviceDetail />}
            ></Route>
            <Route
              path="/Device-Management"
              element={<DeviceManagement />}
            ></Route>
          </Routes>
        </ContentWrapper>
      </AppWrapper>
    </BrowserRouter>
  );
};

export default App;
