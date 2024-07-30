import React from "react";
import { Card } from "react-bootstrap";
import './NotificationCard.scss';

function NotificationCard({ info, titulo }) {
  return (
    <Card className="notification-card">
      <Card.Body>
        <Card.Text className="notification-title">{titulo}</Card.Text>
        <Card.Text className="notification-description">{info}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default NotificationCard;
