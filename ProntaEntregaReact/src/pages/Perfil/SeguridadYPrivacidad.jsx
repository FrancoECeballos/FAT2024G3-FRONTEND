import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Col, Row, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import fetchData from '../../functions/fetchData.jsx';

import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';
import fetchUser from "../../functions/fetchUser.jsx";
import { useNavigate } from 'react-router-dom';

function SeguridadYPrivacidad(){
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({viewedUser: {}, viewingUser: {}, viewingOtherUser: false});
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const updateUser = async () => {
            try {
                const result = await fetchUser(navigate);
                if (location.state) {
                    const viewedUserResult = await fetchData(`/user/${location.state.user_email}`, token);
                    setUser({viewedUser: viewedUserResult, viewingUser: result, viewingOtherUser: true});
                } else {
                    setUser({viewedUser: result, viewingUser: result, viewingOtherUser: false});
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
    
        updateUser();
    }, [token, navigate, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword !== newPasswordRepeat) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/cambiar_contrasenia/', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_repeat: newPasswordRepeat
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage(response.data.success);
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div>;
    }
    
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Row style={{ height: "100vh" }}>
                <Col xs={12} sm={3} md={3} lg={3} xl={3} xxl={3}>
                    <Sidebar selectedPage={"seguridad"} user={user}/>
                </Col>
                <Col xs={12} sm={9} md={9} lg={9} xl={9} xxl={9}>
                    <div>
                        <h2>Cambiar Contraseña</h2>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formOldPassword">
                                <Form.Label>Contraseña Antigua</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPasswordRepeat">
                                <Form.Label>Repetir Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPasswordRepeat}
                                    onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Cambiar Contraseña
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SeguridadYPrivacidad;