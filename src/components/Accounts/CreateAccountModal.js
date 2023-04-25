import React, { useState } from "react";
import { Button, Checkbox, Form, Modal , Icon} from "semantic-ui-react";
import "../style.css";
import axios from "axios";

function CreateAccount({ account }) {
  const [name, setName] = useState(account?.name || "");
  const [group, setGroup] = useState(account?.group || "");
  const [balance, setBalance] = useState(account?.balance || "");
  const [modalOpen, setModalOpen] = useState(false);

  const namehandler = (event) => {
    setName(event.target.value);
  };
  const amounthandler = (event) => {
    setBalance(event.target.value);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    const newAccount = {
      name: name,
      group: group,
      balance: balance,
    };
    axios
      .post("http://127.0.0.1:8000/api/accounts/", newAccount)
      .then((response) => {
        setName("");
        setGroup("");
        setBalance("");
        setModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <Modal open={modalOpen} onClose={handleClose} className="custom-modal">
        <br></br>
        <br></br>
        <br></br>
        <Modal.Header>New Account</Modal.Header>
        <Modal.Content>
          <Form className="ui form account-form" onSubmit={submitHandler}>
            <Form.Group widths="equal">
              <Form.Field required>
                <label htmlFor="name">Name</label>
                <div className="ui input">
                  <input
                    id="name"
                    placeholder="Account name"
                    required
                    type="text"
                    value={name}
                    onChange={namehandler}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label htmlFor="group">Group</label>
                <Form.Select
                  id="group"
                  options={[
                    { key: "CASH", value: "CASH", text: "Cash" },
                    { key: "BANK_ACCOUNT", value: "BANK_ACCOUNT", text: "Bank Account" },
                    { key: "DEPOSIT", value: "DEPOSIT", text: "Deposit" },
                    { key: "CREDIT", value: "CREDIT", text: "Credit" },
                    { key: "ASSET", value: "ASSET", text: "Asset" },
                  ]}
                  onChange={(event, data) => setGroup(data.value)}
                  value={group}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <Checkbox id="INR" label="INR" value="INR" checked />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  id="balance"
                  label="Balance"
                  type="number"
                  step="0.01"
                  labelPosition="right"
                  placeholder="Balance"
                  onChange={amounthandler}
                  value={balance}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <Checkbox id="USD" label="USD" value="USD"/>
              </Form.Field>
              <Form.Field>
                <Form.Input
                  id="balance"
                  label="Balance"
                  type="number"
                  step="0.01"
                  labelPosition="right"
                  placeholder="Balance"
                  onChange={amounthandler}
                  value={balance}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            content="Save"
            labelPosition="right"
            icon="checkmark"
            positive
            onClick={submitHandler}
          />
        </Modal.Actions>
      </Modal>
      <div className="container-header">
      <div className="ui basic buttons">
        <Button icon labelPosition="left" onClick={handleOpen}>
          <Icon name="plus" />
          New
        </Button>
      </div>
    </div>
    </div>
  );
};

export default CreateAccount;
