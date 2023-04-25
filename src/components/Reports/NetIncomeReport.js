import React, { useState, useEffect } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";

function NetIncomeChart({ year, month, type }) {
  console.log(year, month, type, "inside eichart");
  const [chartSeries, setChartSeries] = useState([
    {
      name: "Incomes",
      data: [],
    },
  ]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
        color:[]
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
      min: -2000,
      max: 5000,
      tickAmount: 14,
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
       let colors = [];

       for (const month in data) {
         const monthData = data[month];
         const monthIndex = parseInt(month) - 1;
         incomes[monthIndex] = monthData.net_income;
         colors.push(monthData.net_income < 0 ? "#f44336" : "#7cb342");
       }
       console.log(colors);
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
         plotOptions: {
           ...options.plotOptions,
           bar: {
             ...options.plotOptions.bar,
             colors: {
               ranges: [
                 {
                   from: -2000,
                   to: 0,
                   color: "#f44336",
                 },
                 {
                   from: 0,
                   to: 5000,
                   color: "#7cb342",
                 },
               ],
             },
           },
         },
         xaxis: {
           categories,
           gridLines: {
             show: true,
             zIndex: 1,
           },
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
        type="bar"
        height={350}
      />
    </>
  );
}

export default NetIncomeChart;