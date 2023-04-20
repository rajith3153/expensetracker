import React from "react";
import { Modal, Button} from "react-bootstrap";
import TestView from "../Forms/TransactionForm";
import axios from "axios";

function EditTransactionModal({ show, transaction, onHide }) {
  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/transactions/${transaction.id}/`)
      .then(() => {
        alert("Transaction deleted successfully!");
        onHide();
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error);
        alert("Error deleting transaction");
      });
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Transaction
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TestView transaction={transaction} style={{ height: "100%" }} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default EditTransactionModal
