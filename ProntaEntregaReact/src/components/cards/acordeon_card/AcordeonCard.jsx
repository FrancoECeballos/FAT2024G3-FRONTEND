import "./AcordeonCard.scss";
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import GenericAccordion from "../../accordions/generic_accordion/GenericAccordion.jsx";

function AcordeonCard({
  foto,
  titulo,
  acordeonTitle,
  descrip1,
  descrip2,
  children,
  onClick,
  accordionChildren,
  hoverable = true,
}) {
  return (
    <div className="acordeon-card-container">
      <Card
        onClick={onClick}
        className={`acordeon-card ${hoverable ? "hoverable-acordeon-card" : ""}`}
      >
        <Row className="g-0 acordeon-card-row">
          <Col xs={4} md={2} className="acordeon-card-col-img">
            <img src={foto} alt={titulo} />
          </Col>
          <Col xs={6} md={8} className="acordeon-card-col-content">
            <h3>{titulo}</h3>
            <div className="description">
              <p>{descrip1}</p>
              <p>{descrip2}</p>
              <GenericAccordion
                titulo={acordeonTitle}
                children={accordionChildren}
              />
            </div>
          </Col>
          <Col xs={2} md={2} className="acordeon-card-col-children">
            {children}
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default AcordeonCard;
