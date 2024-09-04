import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmationModal({ BodyText, OpenButtonStyle, OpenButtonText, CloseButtonText, ConfirmButtonText, onClickConfirm, onClose }) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setShow(false);
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <Button style={OpenButtonStyle} onClick={handleShow}>
                {OpenButtonText ? OpenButtonText : "Abrir Modal"}
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body>
                    {BodyText ? BodyText : "¿Está seguro que desea realizar esta acción?"}
                </Modal.Body>
                <Modal.Footer style={{ height: "3rem" }}>
                    <Button style={{ backgroundColor: "red" }} onClick={handleClose}>
                        {CloseButtonText ? CloseButtonText : "Cerrar"}
                    </Button>
                    <Button style={{ backgroundColor: "green" }} onClick={onClickConfirm}>
                        {ConfirmButtonText ? ConfirmButtonText : "Confirmar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmationModal;