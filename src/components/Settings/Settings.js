import {Button, Accordion, Container} from "semantic-ui-react";
import { useState } from "react";
import TableInfo from "./CurrencyTable";
import TransactionImport from "./Import";

function Settings() {

  const [activeIndex, setActiveIndex] = useState(1);
  const handleTitleClick = (e, { index }) => {
    setActiveIndex(index);
  };
  
  const handleExport = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filename = "transactions.json";
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  return (
    <Container>
      <br />
      <div className="container-full-page mt-settings">
        <TableInfo/>
        <Accordion styled fluid>
          <div className="section">
            <Accordion.Title
              index={0}
              active={activeIndex === 0}
              onClick={handleTitleClick}
            >
              <div className="section__header">
                <h3>Data Import</h3>
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <TransactionImport/>
            </Accordion.Content>
          </div>
          <div className="section">
            <Accordion.Title
              index={1}
              active={activeIndex === 1}
              onClick={handleTitleClick}
            >
              <div className="section__header active">
                <h3>Data Export</h3>
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <div className="section__body">
                <div className="mt-dataExport">
                  <p>Export transactions to a JSON file.</p>
                  <Button basic onClick={handleExport}>
                    <i aria-hidden="true" className="download icon"></i>
                    Export Transactions
                  </Button>
                </div>
              </div>
            </Accordion.Content>
          </div>
        </Accordion>
      </div>
    </Container>
  );
}

export default Settings;
