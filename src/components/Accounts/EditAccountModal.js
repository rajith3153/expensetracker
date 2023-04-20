import { Modal, Form, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";

function EditAccountModal({ open, onClose, account, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance);
      setGroup(account.group);
    }
  }, [account]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://127.0.0.1:8000/api/accounts/${account.id}/`, {
        name,
        balance,
        group,
      })
      .then((res) => {
        onUpdate(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (account) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:8000/api/accounts/${account.id}/`)
        .then(() => {
          onDelete(account.id);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <Modal open={open} onClose={onClose} className="custom-modal">
        <br />
        <br />
        <Modal.Header>Edit Account</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleUpdate}>
            <Form.Field>
              <label>Name</label>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="group">Group</label>
              <Form.Select
                id="group"
                options={[
                  { key: "CASH", value: "CASH", text: "Cash" },
                  {
                    key: "BANK_ACCOUNT",
                    value: "BANK_ACCOUNT",
                    text: "Bank Account",
                  },
                  { key: "DEPOSIT", value: "DEPOSIT", text: "Deposit" },
                  { key: "CREDIT", value: "CREDIT", text: "Credit" },
                  { key: "ASSET", value: "ASSET", text: "Asset" },
                ]}
                onChange={(event, data) => setGroup(data.value)}
                value={group}
              />
            </Form.Field>
            <Form.Field>
              <label>Balance</label>
              <input
                placeholder="Balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </Form.Field>
            <Button type="submit" color="blue">
              Save
            </Button>
            <Button
              type="button"
              color="red"
              onClick={() => handleDelete(account)}
            >
              Delete
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default EditAccountModal;
