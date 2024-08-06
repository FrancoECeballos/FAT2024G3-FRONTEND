import React from "react";
import { Card } from 'react-bootstrap';

import notPic from "../../../assets/no_image.png";

function LittleCard({ foto, titulo, descrip1, selected, onSelect }) {
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card 
      onClick={handleCardClick} 
      style={{ 
        width: '18rem', 
        flex: "0 0 auto", 
        borderColor: selected ? 'blue' : 'white', 
        borderWidth: selected ? '2px' : '1px', 
        borderStyle: 'solid' 
      }}
    >
      <Card.Img variant="top" src={foto || notPic} style={{ width: "10rem", justifyContent: "center", margin: "0 auto", maxHeight: '8rem' }} />
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