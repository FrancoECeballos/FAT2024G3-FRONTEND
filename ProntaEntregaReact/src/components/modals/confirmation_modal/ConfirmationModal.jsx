import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ConfirmationModal.scss'; // Archivo de estilos para personalizaciones adicionales

function ConfirmationModal({ BodyText, Open, CloseButtonText, ConfirmButtonText, onClickConfirm, onClose }) {
    const [show, setShow] = useState(Open);

    useEffect(() => {
        setShow(Open);
    }, [Open]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setShow(false);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="custom-modal" // Clase personalizada para estilos del modal
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
                <Button className="custom-confirm-button" onClick={onClickConfirm}>
                    {ConfirmButtonText ? ConfirmButtonText : "Confirmar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
