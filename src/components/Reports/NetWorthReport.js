import React, { useState, useEffect } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";


function NetWorthChart({ year, month, type }) {
    console.log(year, month, type, "inside nwchart");
  const [chartSeries, setChartSeries] = useState([
    {
      name: "Incomes",
      data: [],
    },
  ]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      height: 350,
    },
    plotOptions: {
      line: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yaxis: {
      min: 0,
      max: 15000,
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return val.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          });
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetX: 40,
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      colors: ["#7cb342"],
      width: 2,
      showDots: {
        enabled: true,
        radius: 4,
        hover: {
          size: 6,
        },
      },
    },
  });


  useEffect(() => {
    let url = `http://127.0.0.1:8000/api/reports/?year=${year}&type=${type}`;
    if (month) {
      url += `&month=${month}`;
    }

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data);

        const incomes = Array(12).fill(0);
        

        for (const month in data) {
          const monthData = data[month];
          const monthIndex = parseInt(month) - 1;
          incomes[monthIndex] = monthData.net_worth;
          
        }
        
        console.log("incomes", incomes);
        setChartSeries([
          {
            name: "Net-Income",
            data: incomes,
          },
        ]);
        let categories;
        if (type === "daily") {
          categories = Array.from({ length: 31 }, (_, i) => i + 1);
        } else {
          categories = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
        }
        setChartOptions((options) => ({
          ...options,
          xaxis: {
            categories,
          },
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [year, type, month]);


  

  return (
    <>
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </>
  );
}


export default NetWorthChart;