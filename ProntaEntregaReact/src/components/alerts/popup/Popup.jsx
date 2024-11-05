import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer, ProgressBar } from 'react-bootstrap';
import './Popup.scss';

function Popup({ show, setShow, message, title }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      let interval = setInterval(() => {
        setProgress(prev => (prev > 0 ? prev - 1 : 0));
      }, 30); // Ajusta la velocidad de la barra

      // Oculta el Toast al final del temporizador
      const timer = setTimeout(() => setShow(false), 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setProgress(100); // Reinicia el progreso si el Toast se reabre
    }
  }, [show, setShow]);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setShow(false)} show={show} autohide>
        <Toast.Header className="toast-header">
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>
          {message}
          <ProgressBar
            now={progress}
            className="toast-progress-bar"
            animated
          />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Popup;
