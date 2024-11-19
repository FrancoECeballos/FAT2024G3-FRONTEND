import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Popup from '../../alerts/popup/Popup.jsx';
import './ConfirmationModal.scss';

function ConfirmationModal({ BodyText, Open, CloseButtonText, ConfirmButtonText, onClickConfirm, onClose, showPopup = false, popupTitle = '', popupMessage = '' }) {
    const [show, setShow] = useState(Open);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        setShow(Open);
    }, [Open]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setShow(false);
    };

    const handleConfirmAndClose = async () => {
        try {
            const confirmSuccess = await onClickConfirm();
            if (confirmSuccess) {
                handleClose();
                if (showPopup) {
                    setPopup(true);
                }
            } else {
                console.error("Confirm operation failed.");
            }
        } catch (error) {
            console.error("Error during confirm operation:", error);
        }
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName="custom-modal"
            >
                <Modal.Body className="text-center">
                    <p className="modal-body-text">
                        {BodyText ? BodyText : "¿Está seguro que desea realizar esta acción?"}
                    </p>
                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                    <Button className="custom-cancel-button" onClick={handleClose}>
                        {CloseButtonText ? CloseButtonText : "Cerrar"}
                    </Button>
                    <Button className="custom-confirm-button" onClick={handleConfirmAndClose}>
                        {ConfirmButtonText ? ConfirmButtonText : "Confirmar"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {showPopup && <Popup show={popup} setShow={setPopup} title={popupTitle} message={popupMessage} />}
        </>
    );
}

export default ConfirmationModal;