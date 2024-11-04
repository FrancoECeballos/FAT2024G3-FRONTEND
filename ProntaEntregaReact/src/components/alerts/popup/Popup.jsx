import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function Popup({ show, setShow }) {
  return (
    <ToastContainer position="top-end">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>This is a toast message.</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Popup;