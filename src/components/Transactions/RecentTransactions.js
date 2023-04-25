import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Icon, Segment, Header } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "../style.css";
import TransactionFilterForm from "./TransactionFilter";
import EditTransactionModal from "./EditTransactionModal";

function RecentTransactions({ showFilterForm = true, showEditIcon = true } ) {
  const [accounts, setAccounts] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/accounts/")
      .then((response) => {
        const accountsData = response.data.reduce((acc, account) => {
          acc[account.id] = account;
          return acc;
        }, {});
        setAccounts(accountsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    let income = 0;
    let expense = 0;
    axios
      .get("http://127.0.0.1:8000/api/transactions/")
      .then((response) => {
        const transactionsData = response.data.map((transaction) => ({
          ...transaction,
          accountName: accounts[transaction.account]?.name || "Unknown",
          type: transaction.transaction_type,
        }));
        const sortedTransactions = transactionsData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const recentTransactions = sortedTransactions.slice(0, 300);
        setTransactions(recentTransactions);
        recentTransactions.forEach((transaction) => {
          if (transaction.type === "INCOME") {
            income += Number(transaction.amount);
          } else if (transaction.type === "EXPENSE") {
            expense += Number(transaction.amount);
          }
        });
        setTotalIncome(income);
        setTotalExpense(expense);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accounts]);
  
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const handleFilterSubmit = (filters) => {
    const url = "http://127.0.0.1:8000/api/transactions/";
    const params = new URLSearchParams(filters).toString();
    setLoading(true);
    axios
      .get(`${url}?${params}`)
      .then((response) => {
        const transactionsData = response.data.map((transaction) => ({
          ...transaction,
          accountName: accounts[transaction.account]?.name || "Unknown",
          type: transaction.transaction_type,
        }));
        const sortedTransactions = transactionsData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const recentTransactions = sortedTransactions.slice(0, 100);
        setTransactions(recentTransactions);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };
  return (
    <Container>  
      {showFilterForm && <TransactionFilterForm onSubmit={handleFilterSubmit} />}
      <br />
      <div className="container-full-page flat search-page">
      {transactions.length === 0 ? (
        <Header as='h2' textAlign="center">"No transactions are made"</Header>
      ) : (
        <Segment
          loading={loading}
          className="transactions-list__wrapper"
          style={{ width: "100%" }}
        >
          {transactions.map((transaction) => (
            <Segment key={transaction.id} className="transaction-item">
              <div className="transaction-item__date">
                {new Date(transaction.date).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="transaction-item__info-wrapper">
                <div className="transaction-item__info">
                  <div className="transaction-item__account">
                    {accounts[transaction.account]?.name || "Unknown"}
                  </div>
                  <Icon
                    name={
                      transaction.type === "INCOME"
                        ? "arrow left"
                        : transaction.type === "TRANSFER"
                        ? "arrows alternate horizontal"
                        : "arrow right"
                    }
                    color={
                      transaction.type === "INCOME"
                        ? "green"
                        : transaction.type === "TRANSFER"
                        ? "black"
                        : "red"
                    }
                  />
                  <div>
                    {transaction.type === "TRANSFER"
                      ? accounts[transaction.destination_account]?.name
                      : transaction.tags && transaction.tags.length > 0
                      ? transaction.tags.map((tag, index) => (
                          <h5 className="custom-badge" key={index}>
                            {tag.name}
                          </h5>
                        ))
                      : ""}
                  </div>
                  {transaction.note && (
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#929293",
                        paddingLeft: "0.5em",
                      }}
                    >
                      {transaction.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="transaction-item__amount">
                <span
                  className={
                    transaction.type === "INCOME"
                      ? "mono positive"
                      : transaction.type === "EXPENSE"
                      ? "mono negative"
                      : "mono"
                  }
                >
                  Rs{transaction.amount}
                </span>
              </div>
              <br />
              {showEditIcon && (
                  <Icon
                    name="edit"
                    style={{cursor:"pointer"}}
                    onClick={() => handleEditClick(transaction)}
                  />
                )}
            </Segment>
          ))}
        </Segment>
        )}
      </div>
      <br />
      <Segment>
        <Header as="h3" style={{ textAlign: "right", color: "green" }}>
          Total Income: {totalIncome}
        </Header>
        <Header as="h3" style={{ textAlign: "right", color: "red" }}>
          Total Expense: {totalExpense}
        </Header>
      </Segment>
      {selectedTransaction && showModal && (
        <EditTransactionModal
          show={showModal}
          transaction={selectedTransaction}
          onHide={() => setShowModal(false)}
        />
      )}
    </Container>
  );
}
export default RecentTransactions;