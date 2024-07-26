import React from "react";
import { Card } from "react-bootstrap";

function NotificationCard({ info, titulo }) {
  return (
    <Card style={{width:"10rem", height:"5rem"}}>
        <Card.Body>
            <Card.Text className="Titulo">{titulo}</Card.Text>
            <Card.Text className="Descrip">{info}</Card.Text>
        </Card.Body>
    </Card>
  );
}export default NotificationCard;