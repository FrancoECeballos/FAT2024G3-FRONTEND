import React from "react";
import { Card } from 'react-bootstrap';

import notPic from "../../../assets/no_image.png";

function LittleCard({foto, titulo, descrip1}){
 return(
    <Card style={{ width: '18rem', flex:"0 0 auto"}}>
      <Card.Img variant="top" src={foto || notPic} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text>
          {descrip1}
        </Card.Text>
      </Card.Body>
    </Card>
 );
}export default LittleCard;