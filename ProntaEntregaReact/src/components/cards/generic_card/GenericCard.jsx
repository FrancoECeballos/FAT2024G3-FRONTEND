import React from "react";
import { Card, Row, Col } from 'react-bootstrap';
import noImg from '../../../assets/no_image.png';

function GenericCard({ foto, titulo, descrip1, descrip2, descrip3, descrip4, descrip5, children, onClick, cardStyle, imageStyle }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
            <Card 
                onClick={onClick} 
                style={{ 
                    ...cardStyle, 
                    width: '100%', 
                    maxWidth: '800px', 
                    borderRadius: '1rem', 
                    boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', 
                    padding: '0.5rem' 
                }}
            >
                <Row className="g-0">
                    <Col xs={12} md={3} className="d-flex justify-content-center align-items-center">
                        <img 
                            src={foto || noImg} 
                            alt="Card" 
                            style={{ 
                                ...imageStyle, 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: '1rem', 
                                maxHeight: '18rem', 
                                objectFit: 'cover' 
                            }} 
                        />
                    </Col>
                    <Col xs={12} md={7} className="d-flex align-items-center">
                        <div className="p-3">
                            <h3>{titulo}</h3>
                            <div>
                                <p>{descrip1}</p>
                                <p>{descrip2}</p>
                                <p>{descrip3}</p>
                                <p>{descrip4}</p>
                                <p>{descrip5}</p>
                            </div>
                        </div>
                    </Col> 
                    <Col xs={12} md={2} className="d-flex justify-content-end align-items-center">
                        {children}
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default GenericCard;
