import React, { useState, useEffect } from 'react';
import SendButton from '../buttons/send_button/send_button.jsx';
import Modal from 'react-bootstrap/Modal';
import './Modal.scss';

function GenericModal({ openButtonText, openButtonWidth, handleShowModal, handleCloseModal, title, content, saveButtonText, handleSave }) {
  const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        if (handleCloseModal) {
            handleCloseModal();
        }
    };

    const handleShow = () => {
        setShow(true);
        if (handleShowModal) {
            handleShowModal();
        }
    };

  return (
    <>
        <SendButton
            className="btn-modal"
            onClick={handleShow}
            text={openButtonText}
            backcolor='#3E4692'
            letercolor='white'
            wide={openButtonWidth}
        />

        <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <SendButton text="Cerrar" onClick={handleClose}/>
                <SendButton backcolor='#3E4692' letercolor='white' text={saveButtonText} onClick={() => { handleSave(); handleClose();}}/>
            </Modal.Footer>
        </Modal>
    </>
  );
}

export default GenericModal;