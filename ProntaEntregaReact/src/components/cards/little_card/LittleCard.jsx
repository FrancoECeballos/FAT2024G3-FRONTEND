import React from "react";
import { Card } from 'react-bootstrap';

function LittleCard({foto, titulo, descrip1}){
 return(
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={foto} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text>
          {descrip1}
        </Card.Text>
      </Card.Body>
    </Card>
 );
}export default LittleCard;