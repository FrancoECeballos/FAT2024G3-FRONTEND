import React from "react";
import { Card, Row, Col } from 'react-bootstrap';
import noImg from '../../../assets/no_image.png';
import './GenericCard.scss';

function GenericCard({ foto, titulo, descrip1, descrip2, descrip3, descrip4, descrip5, children, onClick, cardStyle, imageStyle, wide, margin, borderRadius, hoverable = true }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: `${margin || '1rem'}`, }}>
            <Card 
                onClick={onClick} 
                className={hoverable ? "hoverable-generic-card" : ""}
                style={{ 
                    ...cardStyle, 
                    width: `${wide || '80%'}`,
                    borderRadius: `${borderRadius || '1rem'}`,
                    boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', 
                    padding: '0.5rem',
                    justifyContent: 'space-between'
                }}
            >
                <Row className="g-0 flex-grow-1">
                    <Col xs={12} md={3} className="d-flex justify-content-center align-items-center">
                        <img 
                            src={foto || noImg} 
                            alt="Card" 
                            style={{ 
                                ...imageStyle, 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: '1rem', 
                                maxHeight: '12rem', 
                                minHeight: '12rem',
                                objectFit: "scale-down" 
                            }} 
                        />
                    </Col>
                    <Col xs={12} md={9}>
                        <Card.Body>
                            <h3 style={{ marginBottom: '1rem' }}>{titulo}</h3>
                            <Card.Text>{descrip1}</Card.Text>
                            <Card.Text>{descrip2}</Card.Text>
                            <Card.Text>{descrip3}</Card.Text>
                            <Card.Text>{descrip4}</Card.Text>
                            <Card.Text>{descrip5}</Card.Text>
                            {children}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default GenericCard;