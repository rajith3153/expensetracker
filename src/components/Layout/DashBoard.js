import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";
import { Container, Row, Col } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import TestView from "../Forms/TransactionForm";
import RecentTransactions from "../Transactions/RecentTransactions";
import {Card} from "semantic-ui-react";

function DashBoard() {
  const [accounts, setAccounts] = useState([]);  
  useEffect(() => {
    async function fetchAccounts() {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/");
      setAccounts(response.data);
    }
    fetchAccounts();
  }, []);
  const groupedAccounts = accounts.reduce((groups, account) => {
    const group = account.group || "Ungrouped";
    if (!groups[group]) {
      groups[group] = {accounts: [], balance: 0};
    }
    groups[group].accounts.push(account);
    groups[group].balance += parseFloat(account.balance);
    return groups;
  }, {});
  
  return (
    <div>
      <br></br>
      <Container >
        <Row>
          <Col>
            <Container>
              <h3>NetWorth : {accounts.reduce((total, account) => total + parseFloat(account.balance), 0)}</h3>
              <Accordion>
                {Object.entries(groupedAccounts).map(([groupName, group]) => (
                  <Accordion.Item key={groupName} eventKey={groupName}>
                    <Accordion.Header >
                      {groupName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{color:"green"}}>Rs {group.balance}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      {group.accounts.map((account) => (
                        <Card key={account.id}>
                          <Card.Content>
                            <Card.Header>{account.name}</Card.Header>
                            <Card.Description style={{fontSize: '1em'}}>Balance: {account.balance}</Card.Description>
                          </Card.Content>
                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Container>
          </Col>
          <Col md={8}>
            <Accordion defaultActiveKey={["0"]} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>NEW TRANSACTION</Accordion.Header>
                <Accordion.Body>
                  <TestView />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header> RECENT TRANSACTIONS </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <RecentTransactions showFilterForm={false} showEditIcon={false}/>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DashBoard;

