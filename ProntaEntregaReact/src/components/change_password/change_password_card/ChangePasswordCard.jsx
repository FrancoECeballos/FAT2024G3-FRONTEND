import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

import './ChangePasswordCard.scss';
import UserDefault from '../../../assets/user_default.png';
import SendButton from '../../buttons/send_button/send_button.jsx';
import postData from '../../../functions/postData.jsx';

const ChangePasswordCard = ({ user }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordRepeat, setShowNewPasswordRepeat] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!token) {
            navigate('/login');
            return;
        }

        if (newPassword !== newPasswordRepeat) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        if (!token || typeof token !== 'string' || token.includes(' ')) {
            setError('Token inválido.');
            return;
        }

        const data = {
            old_password: oldPassword,
            new_password: newPassword,
            new_password_repeat: newPasswordRepeat
        };

        try {
            const response = await postData('/cambiar_contrasenia/', data, token);
            if (response.success) {
                setMessage(response.success);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Ocurrió un error al cambiar la contraseña.');
        }
    };

    const getImageUrl = (image) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return image;
    };

    return (
        <Container className="d-flex justify-content-center align-items-center change-password-container">
            <Card className="outer-card">
                <Card.Body>
                    <Card className="inner-card">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h1 className="font-rubik text-center mb-4">Cambiar Contraseña</h1>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="user-image">
                                        <img src={getImageUrl(user.imagen)} alt="User" />
                                    </div>
                                    <h2 className="font-rubik mx-3">{user.nombreusuario}</h2>
                                </div>
                                {message && <Alert variant="success">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form.Group>
                                    <Form.Label>Contraseña Antigua</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showOldPassword ? "text" : "password"}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                        <InputGroup.Text onClick={() => setShowOldPassword(!showOldPassword)}>
                                            {showOldPassword ? <BsEyeSlash /> : <BsEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <InputGroup.Text onClick={() => setShowNewPassword(!showNewPassword)}>
                                            {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Repetir Nueva Contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showNewPasswordRepeat ? "text" : "password"}
                                            value={newPasswordRepeat}
                                            onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                            required
                                        />
                                        <InputGroup.Text onClick={() => setShowNewPasswordRepeat(!showNewPasswordRepeat)}>
                                            {showNewPasswordRepeat ? <BsEyeSlash /> : <BsEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <div className="d-flex justify-content-end mt-4">
                                    <SendButton text="Confirmar Cambio" />
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChangePasswordCard;
