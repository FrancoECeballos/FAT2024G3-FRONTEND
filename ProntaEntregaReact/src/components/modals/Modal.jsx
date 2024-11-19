import React, { useState, useEffect } from 'react';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import Modal from 'react-bootstrap/Modal';
import Popup from '../../components/alerts/popup/Popup.jsx';
import './Modal.scss';

function GenericModal({ buttonTextColor, buttonColor, tamaño, openButtonText, openButtonWidth, handleShowModal, handleCloseModal, 
    title, content, saveButtonText, handleSave, showModal, showButton = true, showDeleteButton = false, deleteButtonText, 
    deleteFunction, saveButtonEnabled = true, saveButtonShown = true, position = false, showPopup = false, popupTitle = '', popupMessage = '' }) {
        
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState(false);

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
        try {
            const saveSuccess = await handleSave();
            if (saveSuccess) {
                handleClose();
                if (showPopup) {
                    setPopup(true);
                }
            } else {
                console.error("Save operation failed.");
            }
        } catch (error) {
            console.error("Error during save operation:", error);
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

            <Modal size={tamaño} style={position ? { top: '5%' } : { display: 'flex', alignItems: 'center', justifyContent: 'center' }} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                    <SendButton text="Cerrar" onClick={handleClose}/>
                    {showDeleteButton && <SendButton backcolor='#FF0000' letercolor='white' text={deleteButtonText ? deleteButtonText : "Eliminar"} onClick={() => { deleteFunction();}}/>}
                    <SendButton backcolor='#3E4692' letercolor='white' text={saveButtonText} onClick={handleSaveAndClose} disabled={!saveButtonEnabled} hid={!saveButtonShown}/>
                </Modal.Footer>
            </Modal>

            {showPopup && <Popup show={popup} setShow={setPopup} title={popupTitle} message={popupMessage} />}
        </>
    );
}

export default GenericModal;