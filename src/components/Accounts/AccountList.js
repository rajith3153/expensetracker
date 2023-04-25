import { Accordion, Icon, Container} from "semantic-ui-react";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateAccount from "./CreateAccountModal";
import EditAccountModal from "./EditAccountModal";
import "../style.css";
import React from "react";

function Account() {
  const [accountList, setAccountList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleEditAccount = (account) => {
    setCurrentAccount(account);
    setModalOpen(true);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/accounts/")
      .then((res) => {
        setAccountList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const groupedAccounts = accountList.reduce((groups, account) => {
    if (!groups[account.group]) {
      groups[account.group] = [];
    }
    groups[account.group].push(account);
    return groups;
  }, {});
  const [state, setState] = useState({ activeIndex: -1 });
  const handleAccordionClick = (event, index) => {
    const { activeIndex } = state;
    const newIndex = activeIndex === index ? -1 : index;
    setState({ activeIndex: newIndex });
  };
  
  return (
    <Container className="new-expense-container">
      <br></br>
      <CreateAccount />
      <Accordion styled fluid activeIndex={state.activeIndex}>
        {Object.entries(groupedAccounts).map(([groupName, accounts], index) => {
          let totalBalance = 0;
          accounts.forEach((account) => {
            totalBalance += parseFloat(account.balance);
          });
          return (
            <React.Fragment key={groupName}>
              <Accordion.Title
                active={state.activeIndex === index}
                index={index}
                onClick={(event) => handleAccordionClick(event, index)}
              >
                <Icon name="dropdown" />
                <span className="group-name">{groupName}</span>
                <span className="group-balance">Rs {totalBalance}</span>
              </Accordion.Title>
              <Accordion.Content active={state.activeIndex === index}>
                <div>
                  {accounts.map((account, accountIndex) => (
                    <React.Fragment key={account.id}>
                      {accountIndex > 0 && <hr />}
                      <div className="account-info">
                        <span>
                          <h3>{account.name}</h3>
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            width: "50%",
                            textAlign: "right",
                            color: "green",
                          }}
                        >
                          Rs {account.balance}
                        </span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Icon
                          name="pencil alternate"
                          color="green"
                          size="med"
                          style={{cursor:"pointer"}}
                          onClick={() => handleEditAccount(account)}
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </Accordion.Content>
            </React.Fragment>
          );
        })}
      </Accordion>
      {currentAccount && (
        <EditAccountModal
        open={modalOpen}
        onClose={handleModalClose}
        account={currentAccount}
        onUpdate={(updatedAccount) => {
          const index = accountList.findIndex(
            (a) => a.id === updatedAccount.id
          );
          if (index >= 0) {
            const newList = [...accountList];
            newList[index] = updatedAccount;
            setAccountList(newList);
          }
          handleModalClose();
        }}
      />
      )}
    </Container>
  );
}

export default Account;
