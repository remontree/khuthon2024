import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import LiveData from "../component/LiveChart";

const MainDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* BasicContainer는 4개로 고정 */
  gap: 20px;
`;

const BasicContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  width: 300px;
  height: 200px;
  gird-column: span 1;
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
      <CustomContainer height={210}>
        {/* <LiveData name={"장치별 전력 사용량"} type={"pie"} data={data} /> */}
        <HighchartsReact
          highcharts={Highcharts}
          options={options("장치별 전력 사용량", "pie")}
        ></HighchartsReact>
      </CustomContainer>
    </MainDisplay>
  );
};

export default Main;
