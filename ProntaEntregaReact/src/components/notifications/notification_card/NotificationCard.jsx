import React from "react";
import { Card } from "react-bootstrap";
import './NotificationCard.scss';

function NotificationCard({ info, titulo, onClick, showDesc = true }) {
  return (
    <Card className="notification-card" onClick={onClick}>
      <Card.Body>
        <Card.Text className="notification-title">{titulo}</Card.Text>
        {showDesc && <Card.Text className="notification-description">{info}</Card.Text>}
      </Card.Body>
    </Card>
  );
}

export default NotificationCard;