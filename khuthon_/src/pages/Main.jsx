import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import LiveData from "../component/LiveChart";
import Energy1 from "../images/Energy1.png";
import Energy2 from "../images/Energy1.png";
import Energy3 from "../images/Energy1.png";
import Energy4 from "../images/Energy1.png";
import Energy5 from "../images/Energy1.png";

const MainDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* BasicContainer는 4개로 고정 */
  gap: 20px;
`;

const BasicContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: 300px;
  height: 200px;
  grid-column: span 1;
`;

const CustomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  grid-column: span 2; /* CustomContainer는 2개로 고정 */
  grid-row: auto;
`;

const MainLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; // 간격을 20px로 설정합니다.
`;

const Child = ({ number }) => {
  return (
    <div>
      <p>여기는 child입니다 : {number}</p>
    </div>
  );
};

const Main = ({ main_Data }) => {
  const basicContainerWidth = 300;
  const gap = 20;
  const customContainerWidth = 2 * basicContainerWidth + gap;
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        setData([]);
        setName("등록되지 않은 디바이스");
        console.log("ewowow");
        handleButtonClick();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleButtonClick = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/main_chart",
      responseType: "json",
    })
      .then((response) => {
        console.log(response.data);
        setData((prevData) => {
          // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
          const newData = [...prevData, response.data];
          return newData;
        });
        setTimeout(handleButtonClick, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(handleButtonClick, 1000);
      });
  };

  const options = (customTitle, chartType) => ({
    title: {
      text: customTitle,
    },
    series: [
      {
        type: chartType,
        data: data,
      },
    ],
  });

  const ImageList = (id) =>
    [
      { icon: Energy1 },
      { icon: Energy2 },
      { icon: Energy3 },
      { icon: Energy4 },
      { icon: Energy5 },
    ][id];

  return (
    <MainDisplay>
      <BasicContainer>
        <Child number={main_Data[0][1]}></Child>
      </BasicContainer>
      <BasicContainer>
        <Child number={main_Data[0][2]}></Child>
      </BasicContainer>
      <BasicContainer>
        <Child number={main_Data[0][3]}></Child>
      </BasicContainer>
      <BasicContainer>
        <Child number={main_Data[0][4]}></Child>
      </BasicContainer>
      <CustomContainer width={customContainerWidth} height={420}>
        {/* <LiveData name={"총 전력 사용량"} type={"line"} data={data} /> */}
        <HighchartsReact
          highcharts={Highcharts}
          options={options("총 전력 사용량", "line")}
        />
        <button onClick={handleButtonClick}></button>
      </CustomContainer>
      <MainLeftColumn>
        <CustomContainer height={200}>
          {/* <LiveData name={"장치별 전력 사용량"} type={"pie"} data={data} /> */}
          <HighchartsReact
            highcharts={Highcharts}
            options={options("장치별 전력 사용량", "pie")}
          />
        </CustomContainer>
        <CustomContainer height={200}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "30px", fontWeight: "bold" }}>
              에너지 소비 효율 등급
            </span>
            <img src={Energy1} style={{ width: "250px", height: "130px" }} />
          </div>
        </CustomContainer>
      </MainLeftColumn>
    </MainDisplay>
  );
};

export default Main;
