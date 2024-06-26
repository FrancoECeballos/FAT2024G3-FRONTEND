import React from "react";
import { Card, Row, Col } from 'react-bootstrap';

function GenericCard({foto, titulo, descrip1, descrip2, children, onClick}) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
            <Card onClick={onClick} style={{ width: '90%', borderRadius: '1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', padding: '0.5rem' }}>
                <Row className="g-0" style={{padding: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Col xs={4} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={foto} style={{ width: '100%', borderRadius: '1rem' }} />
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', marginLeft: '3rem' }}>
                            <h3>{titulo}</h3>
                            <div style={{marginLeft: '1rem'}}>
                                <p>{descrip1}</p>
                                <p>{descrip2}</p>
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

export default GenericCard;
