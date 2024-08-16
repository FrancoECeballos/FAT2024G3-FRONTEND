import React from "react";
import { Card } from 'react-bootstrap';
import './LittleCard.scss';

import notPic from "../../../assets/no_image.png";

function LittleCard({ foto, titulo, descrip1, selected, onSelect, hoverable = true }) {
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card 
      onClick={handleCardClick} 
      className={`card ${selected ? 'selected' : 'not-selected'} ${hoverable ? 'hoverable' : ''}`}
    >
      <Card.Img variant="top" src={foto || notPic} style={{ width: "10rem", justifyContent: "center", margin: "auto", marginTop: "0.5rem", height: '8rem' }} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text>
          {descrip1}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default LittleCard;