import React, { useState } from "react";
import { Container, Dropdown, Button, Form } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ExpenseIncomeChart from "./ExpenseIncomeReport";
import ExpenseTagsChart from "./ExpenseTagsReport";
import NetIncomeChart from "./NetIncomeReport";
import NetWorthChart from "./NetWorthReport";


function Reports() {
  const [chartType, setChartType] = useState("expenses_income");
  const [selectedOption, setSelectedOption] = useState("Monthly");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);



  const handleChartTypeSelect = (eventKey) => {
    setChartType(eventKey);
  };
  const handleOptionSelect = (option) => {
    console.log("handleOptionSelect called with option:", option);
    setSelectedOption(option);
  };
  const handleYearChange = (event) => {
    if (event && event.target && event.target.value) {
      setSelectedYear(parseInt(event.target.value));
      setSelectedMonth(null);
    }
  };
  const handleArrowYear = (increment) => {
    setSelectedYear((prevYear) => prevYear + increment);
  };
  const handleArrowMonth = (increment) => {
    setSelectedMonth((prevMonth) => {
      let newMonth = prevMonth + increment;
      let newYear = selectedYear;
      if (newMonth < 0) {
        newYear--;
        newMonth = 11;
      } else if (newMonth > 11) {
        newYear++;
        newMonth = 0;
      }
      setSelectedYear(newYear);
      return newMonth;
    });
  };
  const monthName = (month) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString("default", { month: "short" });
  };
  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Dropdown onSelect={handleChartTypeSelect}>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {chartType}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="expenses_income">
                Expense & Income
              </Dropdown.Item>
              <Dropdown.Item eventKey="expenses_tags">
                Expense by Tags
              </Dropdown.Item>
              <Dropdown.Item eventKey="net_income">Net Income</Dropdown.Item>
              <Dropdown.Item eventKey="net_worth">Net Worth</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            selection
            options={[
              { key: "expenses_income", value: "expenses_income", text: "Expense & Income" },
              { key: "expenses_tags", value: "expenses_tags", text: "Expense by Tags" },
              { key: "net_income", value: "net_income", text: "Net Income" },
              { key: "net_worth", value: "net_worth", text: "Net Worth" },
            ]}
            value={chartType}
            onChange={handleChartTypeSelect}
          />


          <Button
            variant="light"
            onClick={() => {
              if (selectedOption === "Yearly") {
                handleArrowYear(-1);
              } else {
                handleArrowMonth(-1);
              }
            }}
          >
            <FaAngleLeft />
          </Button>
          <Form>
            <Dropdown onSelect={(option) => handleOptionSelect(option)}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                {selectedOption === "Yearly"
                  ? selectedYear
                  : `${monthName(selectedMonth)}, ${selectedYear}`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Yearly">Yearly</Dropdown.Item>
                <Dropdown.Item eventKey="Monthly">Monthly</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form>
          <Button
            variant="light"
            onClick={() => {
              if (selectedOption === "Yearly") {
                handleArrowYear(+1);
              } else {
                handleArrowMonth(+1);
              }
            }}
          >
            <FaAngleRight />
          </Button>
        </div>
      </Container>
      {chartType === "expenses_income" && (
        <>
          {selectedOption === "Monthly" && (
            <ExpenseIncomeChart
              year={selectedYear}
              month={selectedMonth + 1}
              type="daily"
            />
          )}
          {selectedOption !== "Monthly" && (
            <ExpenseIncomeChart year={selectedYear} type={chartType} />
          )}
        </>
      )}
      {chartType === "expenses_tags" && (
        <>
          {selectedOption === "Monthly" && (
            <ExpenseTagsChart
              year={selectedYear}
              month={selectedMonth + 1}
              type={chartType}
            />
          )}
          {selectedOption !== "Monthly" && (
            <ExpenseTagsChart year={selectedYear} type={chartType} />
          )}
        </>
      )}
      {chartType === "net_income" && (
        <>
          {selectedOption === "Monthly" && (
            <NetIncomeChart
              year={selectedYear}
              month={selectedMonth + 1}
              type="daily"
            />
          )}
          {selectedOption !== "Monthly" && (
            <NetIncomeChart year={selectedYear} type={chartType} />
          )}
        </>
      )}
      {chartType === "net_worth" && <NetWorthChart />}
    </div>
  );
}
export default Reports;