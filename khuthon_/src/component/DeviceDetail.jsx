import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackIcon from "../images/Back-Icon.png";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import LiveData from "./LiveChart";

const DetailGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* BasicContainer는 4개로 고정 */
  gap: 20px;
  margin-top: 20px;
`;

const DetailBasicContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: 300px;
  height: 180px;
  gird-column: span 1;
`;

const DetailCustomContainer = styled.div`
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
  padding-top: 7px;
`;

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

const DetailChild = ({ number }) => {
  return (
    <div>
      <p>여기는 child입니다 : {number}</p>
    </div>
  );
};

const DeviceDetail = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);
  const navigate = useNavigate();

  const handleButtonClickDetail = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/main_chart",
      responseType: "json",
    })
      .then((response) => {
        console.log(response.data);
        setData((prevData) => {
          // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
          if (!Array.isArray(prevData)) {
            // 새로운 데이터를 반환
            return [response.data];
          }
          const newData = [...prevData, response.data];
          return newData;
        });
        setTimeout(handleButtonClickDetail, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(handleButtonClickDetail, 1000);
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/main_chart")
      .then((response) => {
        setData(response.data); // API에서 받은 데이터를 상태로 설정
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const onClick = () => {
    navigate("/Device-Connect");
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={BackIcon}
          onClick={onClick}
          style={{ width: "20px", height: "20px", paddingBottom: "10px" }}
        />
      </div>

      <DetailGallery>
        <DetailBasicContainer>
          <DetailChild number={1} />
        </DetailBasicContainer>
        <DetailBasicContainer>
          <DetailChild number={2} />
        </DetailBasicContainer>
        <DetailBasicContainer>
          <DetailChild number={3} />
        </DetailBasicContainer>
        <DetailBasicContainer>
          <DetailChild number={4} />
        </DetailBasicContainer>
        <DetailCustomContainer width={620} height={400}>
          {/* <LiveData name={"총 전력 사용량"} type={"line"} data={data} /> */}
          <HighchartsReact
            highcharts={Highcharts}
            options={options("총 전력 사용량", "line", data)}
          />
          <button onClick={handleButtonClickDetail}></button>
        </DetailCustomContainer>
        <DetailCustomContainer height={200}>
          {/* <LiveData name={"전력 사용량 분석"} type={"pie"} data={data} /> */}
          <HighchartsReact
            highcharts={Highcharts}
            options={options("전력 사용량 분석", "pie", data)}
          >
            <button onClick={handleButtonClickDetail}></button>
          </HighchartsReact>
        </DetailCustomContainer>
      </DetailGallery>
    </>
  );
};

export default DeviceDetail;
