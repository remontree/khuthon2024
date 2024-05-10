import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackIcon from "../images/Back-Icon.png";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import LiveData from "./LiveChart";
import Energy1 from "../images/Energy1.png";
import Energy2 from "../images/Energy2.png";
import Energy3 from "../images/Energy3.png";
import Energy4 from "../images/Energy4.png";
import Energy5 from "../images/Energy5.png";
import { useParams } from "react-router-dom";

const DetailGallery = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DetailBasicContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: 300px;
  height: 160px;
  gird-column: span 1;
  margin-top: 10px;
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

const ImageList = (id) => {
  switch (id) {
    case 1:
      return Energy1;
    case 2:
      return Energy2;
    case 3:
      return Energy3;
    case 4:
      return Energy4;
    case 5:
      return Energy5;
    // default:
    //   return Energy1; // 기본값으로 Energy1을 반환하거나 다른 기본 이미지를 설정하세요.
  }
};

const DetailChild = ({ index, number, unit }) => {
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

const DeviceDetail = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);
  const { deviceName } = useParams();
  const navigate = useNavigate();

  const [totalData, setTotal] = useState([]);
  const [Avg, setAvg] = useState([]);
  const [detail, setDetail] = useState([]);
  const [vsdata, setVs] = useState([]);
  const [energy, setEnergy] = useState([]);
  var flag = true;
  const [ridx, setRidx] = useState([]);

  const update_data = () => {
    axios({
      method: "get",
      url:
        "http://127.0.0.1:5000/deviceupdate/" + encodeURIComponent(deviceName),
      responseType: "json",
    }).then((response) => {
      console.log(response.data);
      setTotal((prevData) => {
        // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
        if (!Array.isArray(prevData)) {
          // 새로운 데이터를 반환
          return [response.data];
        }
        const newData = [...prevData, response.data[0]];
        return newData;
      });
      setAvg(response.data[1]);
      setDetail(response.data[3]);
      console.log(detail);
      setVs(response.data[2]);
      if (flag == true) {
        setEnergy(response.data[4]);
        flag = false;
      }
      setTimeout(update_data, 1000);
    });
  };

  useEffect(() => {
    setTotal([]);
    setAvg([]);
    setDetail([]);
    setVs([]);
    setEnergy([]);
    var temp = Math.floor(Math.random() * 5) + 1;
    setRidx(temp);
    console.log("ridx", ridx);
    update_data();
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "20px",
          }}
        >
          <DetailBasicContainer>
            <DetailChild
              index={"일일 평균 사용량"}
              number={Avg[0]}
              unit={"kWh"}
            />
          </DetailBasicContainer>
          <DetailBasicContainer>
            <DetailChild
              index={"주간 평균 사용량"}
              number={Avg[1]}
              unit={"kWh"}
            />
          </DetailBasicContainer>
          <DetailBasicContainer>
            <DetailChild
              index={"월간 평균 사용량"}
              number={Avg[2]}
              unit={"kWh"}
            />
          </DetailBasicContainer>
          <DetailBasicContainer>
            <DetailChild index={"-"} />
          </DetailBasicContainer>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DetailCustomContainer width={610} height={430}>
            {/* <LiveData name={"총 전력 사용량"} type={"line"} data={data} /> */}
            <HighchartsReact
              highcharts={Highcharts}
              options={options("총 전력 사용량", "line", totalData)}
            />
          </DetailCustomContainer>
          {/* DetailLeftColumn */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "space-between",
              marginLeft: "50px",
            }}
          >
            <DetailCustomContainer width={610} height={200}>
              {/* <LiveData name={"전력 사용량 분석"} type={"pie"} data={data} /> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: "10px", marginLeft: "10px" }}>
                  <p>가장 많은 에너지를 사용한 장치</p>
                  <p>
                    디바이스명 :
                    <span style={{ fontWeight: "bold" }}>{detail[0]}</span>
                  </p>
                  <p>
                    총 전력 사용량 :
                    <span style={{ fontWeight: "bold" }}>{detail[1]}</span> kWh
                  </p>
                  <p>
                    일별 평균 소모량 :
                    <span style={{ fontWeight: "bold" }}>{detail[2]}</span> kWh
                  </p>
                  <p>
                    전력 소모량 최대 시간대 :
                    <span style={{ fontWeight: "bold" }}>{detail[3]}</span>
                  </p>
                  <p>
                    전력 소모량 최소 시간대 :
                    <span style={{ fontWeight: "bold" }}>{detail[4]}</span>
                  </p>
                </div>
                <div style={{ width: "300px", height: "200px" }}>
                  <HighchartsReact
                    containerProps={{ style: { height: "100%" } }}
                    highcharts={Highcharts}
                    options={options("전력 사용량 분석", "pie", vsdata)}
                  ></HighchartsReact>
                </div>
              </div>
            </DetailCustomContainer>
            <DetailCustomContainer width={610} height={200}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "-10px",
                  }}
                >
                  <span style={{ marginRight: "30px", fontWeight: "bold" }}>
                    에너지 소비 효율 등급
                  </span>
                  <p>
                    전력 사용량:{" "}
                    <span style={{ fontWeight: "bold" }}>{vsdata[0]} </span>
                    kWh
                  </p>
                  <p
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    {energy}%
                  </p>
                </div>
                <img
                  src={ImageList(ridx)}
                  style={{ width: "250px", height: "130px" }}
                />
              </div>
            </DetailCustomContainer>
          </div>
        </div>
      </DetailGallery>
    </>
  );
};

export default DeviceDetail;
