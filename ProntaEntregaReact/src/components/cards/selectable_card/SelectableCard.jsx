import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './SelectableCard.scss';

function SelectableCard ({ wide, id, titulo, foto, onCardSelect, isSelected,height,pad,mar,shadow="none"}){
    const toggleSelection = () => {
        onCardSelect(id);
    };

    return (
        <Card style={{width:`${wide}`,height:`${height}`,marginTop:`${mar}`,boxShadow:`${shadow}`}} className={`card ${isSelected ? 'selected' : ''}`} onClick={toggleSelection}>
            <Card.Body style={{padding:`${pad}`}}>
                <Row>
                    <Col xs={4} s={4} m={4} l={4} xl={4}>
                        <Card.Img src={foto || notPic} style={{ width: "4rem", justifyContent: "center", marginTop: "0.5rem" }} />
                    </Col>
                    <Col xs={8} s={8} m={8} l={8} xl={8}>
                        <Card.Title style={{justifyContent: "center", marginTop:"1rem"}}>{titulo}</Card.Title>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default SelectableCard;