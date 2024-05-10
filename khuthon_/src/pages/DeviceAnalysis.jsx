import React from "react";
import LiveData from "../component/LiveChart";
import styled from "styled-components";

const AnalysisDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AnalysisBasicContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  width: 300px;
  height: 200px;
  grid-column: span 1;
`;

const AnalysisCustomContainer = styled.div`
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

const AnalysisChild = ({ index, number, unit }) => {
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

const DisconnectButton = ({ num, minus }) => {
  return (
    <div
      style={{
        border: "2px solid lightgray",
        width: "250px",
        borderRadius: "5px",
        paddingLeft: "15px",
        paddingBottom: "15px",
      }}
    >
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{num}</p>
      <div
        style={{
          display: "inline-block",
        }}
      >
        <span style={{ fontWeight: "bold" }}>{minus}</span> kWh 누수
        <button
          style={{
            marginLeft: "10px",
            border: "none",
            backgroundColor: "red",
          }}
        >
          연결 해제
        </button>
      </div>
    </div>
  );
};

const DeviceAnalysis = () => {
  return (
    <>
      <AnalysisDisplay>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "20px",
          }}
        >
          <AnalysisBasicContainer>
            <AnalysisChild
              index={"전력 소모량 최대 시간대"}
              number={19}
              unit={"시"}
            ></AnalysisChild>
          </AnalysisBasicContainer>
          <AnalysisBasicContainer>
            <AnalysisChild
              index={"전력 소모량 최소 시간대"}
              number={5}
              unit={"시"}
            ></AnalysisChild>
          </AnalysisBasicContainer>
          <AnalysisBasicContainer>
            <AnalysisChild
              index={"이번달 예측 전기요금"}
              number={11524}
              unit={"원"}
            ></AnalysisChild>
          </AnalysisBasicContainer>
          <AnalysisBasicContainer>
            <AnalysisChild
              index={"지난달 대비 전력 사용량"}
              number={34}
              unit={"kWh"}
            ></AnalysisChild>
          </AnalysisBasicContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <AnalysisCustomContainer width={1270} height={200}>
            <div style={{ display: "flex", gap: "20px" }}>
              <DisconnectButton num={53231} minus={401} />
              <DisconnectButton num={53235} minus={582} />
              <DisconnectButton num={53236} minus={312} />
              <DisconnectButton num={53241} minus={455} />
            </div>
          </AnalysisCustomContainer>
        </div>
      </AnalysisDisplay>
    </>
  );
};

export default DeviceAnalysis;
