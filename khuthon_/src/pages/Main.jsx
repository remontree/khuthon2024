import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const MainDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const BasicContainer = styled.div`
  background-color: white;
  width: 300px;
  height: 200px;
  gird-colum: span 1;
`;

const CustomContainer = styled.div`
  background-color: white;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  grid-column: span 2;
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
        //setName(response.data[0][1])
        setTimeout(handleButtonClick, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(handleButtonClick, 1000);
      });
  };

  const options = {
    title: {
      text: "Real-time Chart with Random Data",
    },
    series: [
      {
        type: "line",
        data: data,
      },
    ],
  };

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
      <CustomContainer width={customContainerWidth} height={485}>
        총 전력 사용량
        <HighchartsReact highcharts={Highcharts} options={options} />
        <button onClick={handleButtonClick}></button>
      </CustomContainer>
      <CustomContainer height={250}>장치별 전력 사용량</CustomContainer>
    </MainDisplay>
  );
};

export default Main;
