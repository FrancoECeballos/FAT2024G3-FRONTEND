import React from "react";
import { Card } from 'react-bootstrap';
import './LittleCard.scss';

import notPic from "../../../assets/no_image.png";

function LittleCard({ foto, titulo, descrip1, descrip2, selected, onSelect, hoverable = true, greyedOut = false }) {
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card 
      onClick={handleCardClick} 
      className={`litcard ${selected ? 'selected' : 'not-selected'} ${hoverable ? 'hoverable-little-card' : ''} ${greyedOut ? 'greyed-out' : ''}`}
      style={{maxHeight:'20rem', maxWidth:'15rem'}}
    >
      <Card.Img variant="top" src={foto || notPic} style={{ width: "10rem", justifyContent: "center", margin: "auto", marginTop: "0.5rem", height: '9rem' }} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text style={{maxWidth:"15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {descrip1} <br />
          {descrip2}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default LittleCard;