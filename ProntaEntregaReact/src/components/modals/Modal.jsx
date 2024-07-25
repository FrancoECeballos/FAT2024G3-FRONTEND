import React, { useState, useEffect } from 'react';
import SendButton from '../buttons/send_button/send_button.jsx';
import Modal from 'react-bootstrap/Modal';
import './Modal.scss';

function GenericModal({ openButtonText, title, content, saveButtonText, handleSave }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <SendButton
            className="btn-modal"
            onClick={handleShow}
            text={openButtonText}
            backcolor='#3E4692'
            letercolor='white'
        />

        <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <SendButton text="Cerrar" onClick={handleClose}/>
                <SendButton text={saveButtonText} onClick={() => { handleSave(); handleClose();}}/>
            </Modal.Footer>
        </Modal>
    </>
  );
}

export default GenericModal;