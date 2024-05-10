import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LiveData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        setData([]);
      });
  }, []);

  const handleButtonClick = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/live-data",
      responseType: "json",
    })
      .then((response) => {
        setData((prevData) => {
          // 이전 상태를 가져와서 새로운 데이터를 추가합니다.
          const newData = [...prevData, response.data[1]];
          console.log(newData);
          return newData;
        });
        setTimeout(handleButtonClick, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
    <div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <button onClick={handleButtonClick}>button</button>
    </div>
  );
};

export default LiveData;
