import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import "./GenericAlert.scss";

function GenericAlert({
  ttamaño,
  ptamaño,
  title,
  description,
  type,
  show,
  setShow,
}) {
  if (show) {
    return (
      <Alert variant={type} onClose={() => setShow(false)} dismissible>
        <Alert.Heading style={{ fontSize: `${ttamaño}rem` }}>
          {title}
        </Alert.Heading>
        <p style={{ fontSize: `${ptamaño}rem` }}>{description}</p>
      </Alert>
    );
  }
}

export default GenericAlert;
