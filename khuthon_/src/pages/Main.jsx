import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import LiveData from "../component/LiveChart";
import PolarBear1 from "../images/PolarBear1.png";
import PolarBear2 from "../images/PolarBear2.png";
import PolarBear3 from "../images/PolarBear3.png";
import PolarBear4 from "../images/PolarBear4.png";
import PolarBear5 from "../images/PolarBear5.png";

const MainDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const Child = ({ index, number, unit }) => {
  return (
    <div style={{ marginLeft: "-70px" }}>
      <p style={{ fontWeight: "bold" }}>{index}</p>
      <span
        style={{
          fontSize: "50px",
          fontWeight: "bold",
        }}
      >
        {number}
      </span>
      <span style={{ fontSize: "30px", paddingLeft: "10px" }}>{unit}</span>
    </div>
  );
};

const PolarBearList = (id) => {
  switch (id) {
    case 1:
      return PolarBear1;
    case 2:
      return PolarBear2;
    case 3:
      return PolarBear3;
    case 4:
      return PolarBear4;
    case 5:
      return PolarBear5;
  }
};

const PolarBearText = (id) => {
  switch (id) {
    case 1:
      return "북극곰\n 멸종위기";
    case 2:
      return "북극곰\n 불행함";
    case 3:
      return "북극곰\n 그냥 그럼";
    case 4:
      return "북극곰\n 행복함";
    case 5:
      return "북극곰\n 댄스파티";
  }
};

const Main = ({ main_Data }) => {
  const [total_data, setData] = useState([]);
  const [avg_data, setAvg] = useState([]);
  const [electricityfee, setFee] = useState([]);
  const [allusage, setAllUsage] = useState([]);
  const [maxusage, setMaxUsage] = useState([]);
  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((total_data) => {
        setData([]);
        setAvg([]);
        setFee([]);
        setAllUsage([]);
        setMaxUsage([]);
        total_power_usage_update();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        total_power_usage_update();
      });
  }, []);

  const total_power_usage_update = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/main_chart",
      responseType: "json",
    })
      .then((response) => {
        console.log(response.data);
        setData((prevData) => {
          // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
          const newData = [...prevData, response.data[0]];
          return newData;
        });
        setAvg(response.data[1]);
        setFee(response.data[2]);
        setMaxUsage(response.data[3]);
        console.log(response.data[3]);
        setAllUsage(response.data[4]);
        setTimeout(total_power_usage_update, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(total_power_usage_update, 1000);
      });
  };

  const options = (customTitle, chartType, data) => ({
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
    <>
      <MainDisplay>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "20px",
          }}
        >
          <BasicContainer>
            <Child
              index={"일일 평균 사용량"}
              number={avg_data[0]}
              unit={"kWh"}
            ></Child>
          </BasicContainer>
          <BasicContainer>
            <Child
              index={"주간 평균 사용량"}
              number={avg_data[1]}
              unit={"kWh"}
            ></Child>
          </BasicContainer>
          <BasicContainer>
            <Child
              index={"월간 평균 사용량"}
              number={avg_data[2]}
              unit={"kWh"}
            ></Child>
          </BasicContainer>
          <BasicContainer>
            <Child
              index={"예측 전기요금"}
              number={electricityfee}
              unit={"원"}
            ></Child>
          </BasicContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <CustomContainer width={610} height={420}>
            {/* <LiveData name={"총 전력 사용량"} type={"line"} data={data} /> */}
            <HighchartsReact
              highcharts={Highcharts}
              options={options("총 전력 사용량", "line", total_data)}
            />
          </CustomContainer>
          <MainLeftColumn>
            <CustomContainer width={610} height={200}>
              {/* <LiveData name={"장치별 전력 사용량"} type={"pie"} data={data} /> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: "12px", marginLeft: "10px" }}>
                  <p>가장 많은 에너지를 사용한 장치</p>
                  <p>
                    디바이스명 :{" "}
                    <span style={{ fontWeight: "bold" }}>{maxusage[0]}</span>
                  </p>
                  <p>
                    총 전력 사용량 :{" "}
                    <span style={{ fontWeight: "bold" }}>{maxusage[1]}</span>{" "}
                    kWh
                  </p>
                  <p>
                    일별 평균 소모량 :{" "}
                    <span style={{ fontWeight: "bold" }}>{maxusage[2]}</span>{" "}
                    kWh
                  </p>
                </div>
                <div style={{ width: "300px", height: "200px" }}>
                  <HighchartsReact
                    containerProps={{ style: { height: "100%" } }}
                    highcharts={Highcharts}
                    options={options("장치별 전력 사용량", "pie", allusage)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </CustomContainer>
            <CustomContainer height={200}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#2CD2F6",
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  {PolarBearText(4)}
                </span>
                <img
                  src={PolarBearList(4)}
                  style={{ width: "250px", height: "190px" }}
                />
              </div>
            </CustomContainer>
          </MainLeftColumn>
        </div>
      </MainDisplay>
    </>
  );
};

export default Main;
