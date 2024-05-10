import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";

const GraphSize = styled.div`
  width: 620px;
  // line그래프와 pie그래프만 사용할 것이므로 line일 때와 아닐때로 구분함
  height: ${(props) => (props.chartType === "line" ? "420px" : "200px")};
`;

const LiveData = (props) => {
  const [data, setData] = useState([]);

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
          if (!Array.isArray(prevData)) {
            // 새로운 데이터를 반환
            return [response.data];
          }
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
    <div>
      <GraphSize>
        <HighchartsReact
          highcharts={Highcharts}
          options={options(props.name, props.type, props.data)}
        />
      </GraphSize>
      <button onClick={handleButtonClick}>button</button>
    </div>
  );
};

export default LiveData;
