import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Message } from "semantic-ui-react";

function TransactionImport() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transactions/import/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label htmlFor="file">Choose a CSV file:</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
      {message && <Message>{message}</Message>}
    </div>
  );
}
export default TransactionImport;
