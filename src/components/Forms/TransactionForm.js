import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Button, Container } from "semantic-ui-react";
import CreatableSelect from "react-select/creatable";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function TestView({ transaction }) {
  const [accounts, setAccounts] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    transaction?.tags?.map((tag) => ({ value: tag.name, label: tag.name })) ||
      []
  );
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/accounts/").then((response) => {
      setAccounts(response.data);
    });
    axios.get("http://127.0.0.1:8000/api/transactions/").then((response) => {
      setTransactionTypes(response.data);
    });
    axios.get("http://127.0.0.1:8000/api/tags/").then((response) => {
      setTagOptions(
        response.data.map((tag) => ({ value: tag.name, label: tag.name }))
      );
    });
    axios.get("http://127.0.0.1:8000/api/currencies/").then((response) => {
      setCurrencies(
        response.data.map((currency) => ({
          value: currency[0],
          label: currency[1],
        }))
      );
    });
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    account: "",
    destination_account: "",
    transaction_type: "EXPENSE",
    amount: "",
    flag: false,
    tags: [],
    note: "",
    amount_currency: "",
  });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue);
    setFormData({
      ...formData,
      tags: (newValue || []).map((tag) => tag.value),
    });
    (newValue || [])
      .filter((tag) => tag.__isNew__)
      .forEach((tag) => {
        const data = { name: tag.value };
        axios.get("http://127.0.0.1:8000/api/tags/").then((response) => {
          const tags = response.data;
          const tagExists = tags.some(
            (t) => t.name.toLowerCase() === tag.value.toLowerCase()
          );
          if (!tagExists) {
            axios.post("http://127.0.0.1:8000/api/tags/", data).then(() => {
              console.log(`Tag "${tag.value}" added successfully!`);
            });
          } else {
            console.log(`Tag "${tag.value}" already exists!`);
          }
        });
      });
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate;

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction?.date || "",
        account: transaction?.account || "",
        destination_account: transaction?.destination_account || "",
        transaction_type: transaction?.transaction_type || "",
        amount: transaction?.amount || "",
        flag: transaction?.flag || false,
        tags: transaction?.tags || [],
        note: transaction?.note || "",
        amount_currency: transaction?.amount_currency || "",
      });
      setIsEditMode(true);
    }
  }, [transaction]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      account: formData.account,
      destination_account: formData.destination_account,
      transaction_type: formData.transaction_type,
      amount: formData.amount,
      date: formData.date,
      tags: selectedTags.map((tag) => ({ id: tag.id, name: tag.value })),
      note: formData.note,
      amount_currency: formData.amount_currency,
    };
    if (isEditMode) {
      axios
        .put(`http://127.0.0.1:8000/api/transactions/${transaction.id}/`, data)
        .then(() => {
          alert("Transaction updated successfully!");
          navigate("/");
        })
        .catch((error) => {
          console.log(error.response.data);
          console.log(error);
          alert("Error updating transaction");
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/transactions/", data)
        .then(() => {
          alert("Transaction added successfully!");
          setFormData({
            date: "",
            account: "",
            destination_account: "",
            transaction_type: "EXPENSE",
            amount: "",
            flag: false,
            tags: [],
            note: "",
            amount_currency: "",
          });
          setSelectedTags([]);
        })
        .catch((error) => {
          console.log(error.response.data);
          console.log(error);
          alert("Error adding transaction");
        });
    }
  };
  const handleAnchorClick = (event, type) => {
    event.preventDefault();
    setFormData({ ...formData, transaction_type: type });
  };

  return (
    <Container>
      <div style={{ margin: "1rem auto" }}>
        <div className="mb-3 mt-md-4" style={{ position: "relative" }}>
          <div className="mb-3" style={{ textAlign: "left" }}>
            <Form onSubmit={handleSubmit}>
              <div className="ui attached three item menu">
                <a
                  href="#"
                  className={`item ${
                    formData.transaction_type === "EXPENSE" ? "active" : ""
                  } red`}
                  onClick={(e) => handleAnchorClick(e, "EXPENSE")}
                >
                  Expense
                </a>
                <a
                  href="#"
                  className={`item ${
                    formData.transaction_type === "TRANSFER" ? "active" : ""
                  } black`}
                  onClick={(e) => handleAnchorClick(e, "TRANSFER")}
                >
                  Transfer
                </a>
                <a
                  href="#"
                  className={`item ${
                    formData.transaction_type === "INCOME" ? "active" : ""
                  } green`}
                  onClick={(e) => handleAnchorClick(e, "INCOME")}
                >
                  Income
                </a>
              </div>
              <div className="ui form">
                <div className="fields">
                  <div className="field">
                    <label htmlFor="account">
                      {formData.transaction_type === "EXPENSE"
                        ? "From"
                        : formData.transaction_type === "INCOME"
                        ? "To"
                        : "From"}
                      :
                    </label>
                    <select
                      id="account"
                      name="account"
                      onChange={handleInputChange}
                      value={formData.account}
                      required
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {account.group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="amount">Amount:</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      onChange={handleInputChange}
                      value={formData.amount}
                      required
                    />
                  </div>
                </div>
                <div className="fields">
                  {formData.transaction_type === "TRANSFER" && (
                    <div className="field">
                      <label htmlFor="destination_account">To :</label>
                      <select
                        id="destination_account"
                        name="destination_account"
                        onChange={handleInputChange}
                        value={formData.destination_account}
                        required
                      >
                        <option value="">Select an account</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} - {account.group}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {formData.transaction_type !== "TRANSFER" && (
                    <div className="field">
                      <label htmlFor="tags">Tags:</label>
                      <CreatableSelect
                        isMulti
                        options={tagOptions}
                        onChange={handleTagChange}
                        value={selectedTags}
                      />
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="date">Date:</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      onChange={handleInputChange}
                      value={formData.date}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="note">Note:</label>
                  <textarea
                    id="note"
                    name="note"
                    onChange={handleInputChange}
                    value={formData.note}
                  />
                </div>

                <Button type="submit" className="ui primary button">
                  {isEditMode
                    ? "Update"
                    : (formData.transaction_type === "EXPENSE" &&
                        "Add Expense") ||
                      (formData.transaction_type === "INCOME" &&
                        "Add Income") ||
                      (formData.transaction_type === "TRANSFER" && "Transfer")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default TestView;
