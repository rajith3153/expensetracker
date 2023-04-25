import React from 'react'
import { Table , Accordion, Dropdown} from 'semantic-ui-react'

function TableInfo() {
  return (
    <div>
      <Accordion styled fluid>
          <div className="section">
            <Accordion.Title>
              <div className="section__header active">
                <h3>Currency</h3>
              </div>
            </Accordion.Title>
            <Accordion.Content active>
              <div className="section__body">
                <form className="ui form">
                  <div className="equal width fields">
                    <div className="field">
                      <label>Base Currency</label>
                      <Dropdown
                        selection
                        options={[
                          {
                            key: "INR",
                            text: "INR, Indian Rupee",
                            value: "INR",
                          },
                          {
                            key: "USD",
                            text: "USD, Dollar",
                            value: "USD",
                          },
                          {
                            key: "EUR",
                            text: "EUR, Euro",
                            value: "EUR",
                          },
                        ]}
                        defaultValue="INR"
                      />
                    </div>
                  </div>
                </form>
                <div className="ui basic segment exchange-rate-table">
                <Table celled definition unstackable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell className="center aligned">
                          USD
                        </Table.HeaderCell>
                        <Table.HeaderCell className="center aligned">
                          INR
                        </Table.HeaderCell>
                        <Table.HeaderCell className="center aligned">
                          EUR
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell className="center aligned">USD</Table.Cell>
                        <Table.Cell className="disabled center aligned">
                          1.0000
                        </Table.Cell>
                        <Table.Cell className="center aligned">
                          82.0329
                        </Table.Cell>
                        <Table.Cell className="center aligned">
                          0.9115
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="center aligned">INR</Table.Cell>
                        <Table.Cell className="center aligned">
                          0.0122
                        </Table.Cell>
                        <Table.Cell className="disabled center aligned">
                          1.0000
                        </Table.Cell>
                        <Table.Cell className="center aligned">
                          0.0111
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="center aligned">EUR</Table.Cell>
                        <Table.Cell className="center aligned">
                          1.0971
                        </Table.Cell>
                        <Table.Cell className="center aligned">
                          89.9967
                        </Table.Cell>
                        <Table.Cell className="disabled center aligned">
                          1.0000
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </Accordion.Content>
          </div>
        </Accordion>
    </div>
  )
}

export default TableInfo
