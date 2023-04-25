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
              <Form.Group controlId="transactionType">
                <div className="ui top attached three item menu">
                  <a
                    className={`red item ${
                      formData.transaction_type === "EXPENSE" ? "active" : ""
                    }`}
                    onClick={(e) => handleAnchorClick(e, "EXPENSE")}
                  >
                    Expense
                  </a>
                  <a
                    className={`black item ${
                      formData.transaction_type === "TRANSFER" ? "active" : ""
                    }`}
                    onClick={(e) => handleAnchorClick(e, "TRANSFER")}
                  >
                    Transfer
                  </a>
                  <a
                    className={`green item ${
                      formData.transaction_type === "INCOME" ? "active" : ""
                    }`}
                    onClick={(e) => handleAnchorClick(e, "INCOME")}
                  >
                    Income
                  </a>
                </div>
              </Form.Group>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
                <div style={{ flex: 2 }}>
                  <Form.Group controlId="account">
                    <Form.Label>
                      {formData.transaction_type === "EXPENSE"
                        ? "From"
                        : formData.transaction_type === "INCOME"
                        ? "To"
                        : "From"}
                      :
                    </Form.Label>
                    <Form.Control
                      as="select"
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
                    </Form.Control>
                  </Form.Group>
                </div>
                <Form.Group controlId="amount">
                  <Form.Label>Amount:</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    onChange={handleInputChange}
                    value={formData.amount}
                    required
                  />
                </Form.Group>
              </div>

              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
                {formData.transaction_type === "TRANSFER" && (
                  <div style={{ flex: 2 }}>
                    <Form.Group controlId="destination_account">
                      <Form.Label>To :</Form.Label>
                      <Form.Control
                        as="select"
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
                      </Form.Control>
                    </Form.Group>
                  </div>
                )}
                {formData.transaction_type !== "TRANSFER" && (
                  <div style={{ flex: 2 }}>
                    <Form.Group controlId="tags">
                      <Form.Label>Tags:</Form.Label>
                      <CreatableSelect
                        isMulti
                        options={tagOptions}
                        onChange={handleTagChange}
                        value={selectedTags}
                      />
                    </Form.Group>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <Form.Group controlId="date">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      onChange={handleInputChange}
                      value={formData.date}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <div style={{ flex: 2, marginRight: 16 }}>
                  <Form.Group controlId="note">
                    <Form.Label>Note:</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="note"
                      onChange={handleInputChange}
                      value={formData.note}
                    />
                  </Form.Group>
                </div>
                <div style={{ flex: 0.5 }}>
                  <Button type="submit" className="ui fluid primary button">
                    {isEditMode
                      ? "Update"
                      : (formData.transaction_type === "EXPENSE" &&
                          "Add Expense") ||
                        (formData.transaction_type === "INCOME" &&
                          "Add Income") ||
                        (formData.transaction_type === "TRANSFER" &&
                          "Add Transfer")}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default TestView;