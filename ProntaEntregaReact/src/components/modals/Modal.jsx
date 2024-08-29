    import React, { useState, useEffect } from 'react';
    import SendButton from '../buttons/send_button/send_button.jsx';
    import Modal from 'react-bootstrap/Modal';
    import './Modal.scss';

    function GenericModal({ buttonTextColor, buttonColor, tamaño, openButtonText, openButtonWidth, handleShowModal, handleCloseModal, title, content, saveButtonText, handleSave, showModal, showButton = true, showDeleteButton = false, deleteButtonText, deleteFunction, saveButtonDisabled = false}) {
        const [show, setShow] = useState(false);

        useEffect(() => {
            setShow(showModal);
        }, [showModal]);

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

        const handleSaveAndClose = async () => {
            const saveSuccess = await handleSave();
            if (saveSuccess) {
                handleClose();
            }
        };
        

    return (
        <>
            <SendButton
            className="btn-modal"
            onClick={handleShow}
            text={openButtonText}
            backcolor={buttonColor || "#3E4692"}
            letercolor={buttonTextColor || "white"}
            wide={openButtonWidth}
            hid={!showButton}
            />

            <Modal size={tamaño} centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <SendButton text="Cerrar" onClick={handleClose}/>
                {showDeleteButton && <SendButton backcolor='#FF0000' letercolor='white' text={deleteButtonText ? deleteButtonText : "Eliminar"} onClick={() => { deleteFunction(); handleClose();}}/>}
                <SendButton backcolor='#3E4692' letercolor='white' text={saveButtonText} onClick={handleSaveAndClose} disabled={saveButtonDisabled}/>
            </Modal.Footer>
            </Modal>
        </>
        );
}

export default GenericModal;