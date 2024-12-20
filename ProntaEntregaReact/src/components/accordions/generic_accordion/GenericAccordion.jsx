import React from "react";
import { Accordion, Card } from "react-bootstrap";
import "./GenericAccordion.scss";

const GenericAccordion = ({ wide, titulo, children }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card className="genericaccordeon" style={{ width: `${wide}` }}>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div>
                <h5>{titulo}</h5>
              </div>
            </Accordion.Header>
            <Accordion.Body
              style={{
                backgroundColor: "#F5F5F5",
                paddingLeft: "0rem",
                paddingRight: "0rem",
              }}
            >
              {children}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  );
};

export default GenericAccordion;
