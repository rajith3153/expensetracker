import React, { useState, useEffect } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";


function ExpenseIncomeChart({ year, month, type }) {
  const [chartSeries, setChartSeries] = useState([
    {
      name: "Incomes",
      data: [],
    },
    {
      name: "Expenses",
      data: [],
    },
  ]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      grouped: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
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
      max: 50000,
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
      const expenses = Array(12).fill(0);
      for (const month in data) {
        const monthData = data[month];
        const monthIndex = parseInt(month) - 1;
        incomes[monthIndex] = monthData.total_income;
        expenses[monthIndex] = monthData.total_expenses;
      }
      setChartSeries([
        {
          name: "Incomes",
          data: incomes,
        },
        {
          name: "Expenses",
          data: expenses,
        },
      ]);
      if (month >=0) {
        const daysInMonth = new Date(year, month, 0).getDate();
        setChartOptions((options) => ({
          ...options,
          xaxis: {
            categories: Array(daysInMonth)
              .fill()
              .map((_, index) => `${index + 1}`),
          },
        }));
      }
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
export default ExpenseIncomeChart;