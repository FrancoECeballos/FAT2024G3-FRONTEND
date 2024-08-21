import React from 'react';
import { Card } from 'react-bootstrap';
import './SelectableCard.scss';

const SelectableCard = ({ id, titulo, foto, onCardSelect, isSelected }) => {
    const toggleSelection = () => {
        onCardSelect(id);
    };

    return (
        <Card className={`card ${isSelected ? 'selected' : ''}`} onClick={toggleSelection}>
            <Card.Body>
                <Card.Img src={foto || notPic} style={{ width: "10rem", justifyContent: "center", margin: "auto", marginTop: "0.5rem", height: '9rem' }} />
                <Card.Title>{titulo}</Card.Title>
            </Card.Body>
        </Card>
    );
};

export default SelectableCard;