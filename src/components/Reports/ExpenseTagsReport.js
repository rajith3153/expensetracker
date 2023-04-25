import ApexCharts from "react-apexcharts";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ExpenseTagsChart({ year, month, type }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    let url = `http://127.0.0.1:8000/api/reports/?year=${year}&type=${type}`;
    if (month) {
      url += `&month=${month}`;
    }

    axios.get(url).then((response) => {
      const filteredData = Object.keys(response.data)
        .filter((key) => response.data[key].hasOwnProperty("percentage"))
        .map((key) => ({
          name: key,
          data: response.data[key].total_expenses,
        }));
      setTags(filteredData);
    });
  }, [year, month, type]);

  const options = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        startingShape: "flat",
        endingShape: "flat",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: tags.map((tag) => tag.name),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Total Expenses",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const series = [
    {
      name: "Total Expenses",
      data: tags.map((tag) => tag.data),
    },
  ];

  return (
    <div>
      <ApexCharts options={options} series={series} type="bar" height={350} />
    </div>
  );
}

export default ExpenseTagsChart;