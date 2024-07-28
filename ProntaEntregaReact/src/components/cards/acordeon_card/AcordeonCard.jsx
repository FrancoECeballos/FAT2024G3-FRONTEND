import { disableCache } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Card, Row, Col } from 'react-bootstrap';

import GenericAccordion from "../../accordions/generic_accordion/GenericAccordion.jsx";

function AcordeonCard({foto, titulo, acordeonTitle, descrip1, descrip2, children, onClick, accordionChildren}){
    return(
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
            <Card onClick={onClick} style={{ width: '90%', borderRadius: '1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', padding: '0.5rem' }}>
                <Row className="g-0" style={{ padding: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Col xs={4} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={foto} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '1rem', objectFit: 'cover' }} />
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', marginLeft: '3rem' }}>
                            <h3>{titulo}</h3>
                            <div style={{ marginLeft: '1rem' }}>
                                <p>{descrip1}</p>
                                <p>{descrip2}</p>
                                <GenericAccordion titulo={acordeonTitle} children={accordionChildren} />
                            </div>
                        </div>
                    </Col>
                    <Col xs={2} md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {children}
                    </Col>
                </Row>
            </Card>
        </div>
    );
}
export default AcordeonCard;