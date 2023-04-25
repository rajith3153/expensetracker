import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./trans.css";
import { Dropdown } from "semantic-ui-react";
import CreateTransactionModal from "../Forms/TransactionModal";

function TransactionFilterForm({ onSubmit }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTransModal, setNewTransModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const handleOpen = () => setNewTransModal(true);
  const handleClose = () => setNewTransModal(false);
  const [filterData, setFilterData] = useState({});

  const options = [
    { key: "today", text: "Today", value: "today" },
    { key: "yesterday", text: "Yesterday", value: "yesterday" },
    { key: "last7days", text: "Last 7 days", value: "last7days" },
    { key: "last30days", text: "Last 30 days", value: "last30days" },
    { key: "thisMonth", text: "This month", value: "thisMonth" },
    { key: "customDate", text: "Custom date", value: "customDate" },
  ];

  const handleDateRangeSelection = (ranges) => {
    const range = ranges.selection;
    setFromDate(range.startDate.toISOString().slice(0, 10));
    setToDate(range.endDate.toISOString().slice(0, 10));
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/filter/", {
        params: {
          from_date: fromDate,
          to_date: toDate,
          tags: selectedTags.map((tag) => tag.value).join(","),
          transaction_type: transactionType,
          accounts: selectedAccount,
        },
      })
      .then((response) => {
        setFilterData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fromDate, toDate, selectedTags, transactionType, selectedAccount]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/tags/").then((response) => {
      setTags(
        response.data.map((tag) => ({ value: tag.name, label: tag.name }))
      );
    });
    axios.get("http://127.0.0.1:8000/api/accounts/").then((response) => {
      setAccounts(
        response.data.map((account) => ({
          value: account.name,
          label: account.name,
        }))
      );
    });
  }, []);
  const handleAccountsChange = (selected) => {
    setSelectedAccount(selected.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      from_date: fromDate,
      to_date: toDate,
      tags: selectedTags.map((tag) => tag.value).join(","),
      transaction_type: transactionType,
      accounts: selectedAccount,
    });
  };
  const handleTagsChange = (selected) => {
    setSelectedTags(selected);
  };
  const handleDateSelection = (selection) => {
    switch (selection) {
      case "today":
        setFromDate(new Date().toISOString().slice(0, 10));
        setToDate(new Date().toISOString().slice(0, 10));
        break;
      case "yesterday":
        const yesterday = new Date(Date.now() - 86400000);
        setFromDate(yesterday.toISOString().slice(0, 10));
        setToDate(yesterday.toISOString().slice(0, 10));
        break;
      case "last7days":
        const last7days = new Date(Date.now() - 7 * 86400000);
        setFromDate(last7days.toISOString().slice(0, 10));
        setToDate(new Date().toISOString().slice(0, 10));
        break;
      case "thisMonth":
        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const lastDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        setFromDate(firstDayOfMonth.toISOString().slice(0, 10));
        setToDate(lastDayOfMonth.toISOString().slice(0, 10));
        break;
      default:
        setShowModal(true);
        break;
    }
  };
  const dateRangePicker = (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select date range</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DateRangePicker
          ranges={[
            {
              startDate: new Date(fromDate),
              endDate: new Date(toDate),
              key: "selection",
            },
          ]}
          onChange={handleDateRangeSelection}
          maxDate={new Date()}
          direction="horizontal"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => setShowModal(false)}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
  return (
    <div>
      <Form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', margin: '0', padding: '0' }}>
  <div style={{ flex: 1, margin: '0', padding: '0' }}>
    <CreateTransactionModal />
  </div>
  <div style={{ flex: 20, marginTop: '0', margin: '0', padding: '0' }}>
    <Dropdown
      selection
      button
      floating
      labeled
      defaultValue="last7days"
      icon="calendar"
      className="icon labeled"
      options={options}
      onChange={(e, { value }) => handleDateSelection(value)}
    />
  </div>
</div>

        {dateRangePicker}
        <Form.Group controlId="formTags">
          <Form.Label>Tags</Form.Label>
          <Select
            isMulti
            options={tags}
            onChange={handleTagsChange}
            value={selectedTags}
            placeholder="Select tags"
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </Form.Group>
        
        <Form.Group controlId="formTransactionType">
          <Form.Label>Transaction type</Form.Label>
          <br />
          <div className="ui buttons" style={{ display: "flex", gap: "1rem" }}>
            <button
              className={`ui button ${
                transactionType === "expense" ? "active" : ""
              }`}
              onClick={() => setTransactionType("expense")}
            >
              Expense
            </button>
            <button
              className={`ui button ${
                transactionType === "transfer" ? "active" : ""
              }`}
              onClick={() => setTransactionType("transfer")}
            >
              Transfer
            </button>
            <button
              className={`ui button ${
                transactionType === "income" ? "active" : ""
              }`}
              onClick={() => setTransactionType("income")}
            >
              Income
            </button>
            <button
              className={`ui button ${transactionType === "" ? "active" : ""}`}
              onClick={() => setTransactionType("")}
            >
              All
            </button>
            <Button color="blue" type="submit" style={{ marginLeft: "auto" }}>
              Submit
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default TransactionFilterForm;
