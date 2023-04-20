import React, { useState } from "react";
import { Modal} from "semantic-ui-react";
import TestView from "./TransactionForm";
import "../style.css";

const CreateTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        className="custom-modal"
        size="lg"
        centered
      >
        <br></br>
        <br></br>
        <br></br>
        <Modal.Header>Create Transaction</Modal.Header>
        <Modal.Content>
          <TestView />
        </Modal.Content>
      </Modal>
      <div className="container-header">
        <div className="ui basic buttons">
          <button
            className="ui icon left labeled button"
            onClick={() => setIsOpen(true)}
          >
            <i aria-hidden="true" className="plus icon"></i>
            New
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateTransactionModal;
