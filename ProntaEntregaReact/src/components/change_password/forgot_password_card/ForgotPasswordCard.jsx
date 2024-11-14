import React from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import './ForgotPasswordCard.scss';
import SendButton from '../../buttons/send_button/send_button.jsx';

// Necesito:
// GET imagen de perfil y nombre de usuario
// UPDATE contraseña


const ForgotPasswordCard = () => {
    return (
        <Container style={{display: 'flex'}} className="d-flex justify-content-center align-items-center vh-100 forgot-password-container">
            <Card style={{position: 'relative', width: '40rem', borderRadius:'1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
                <Card.Body>
                    <Form>
                        <h1 className="font-rubik" style={{textAlign:"center",margin:'2.8rem', fontSize: '1.5rem'}}>Olvide mi Contraseña</h1>
                        <Form.Label className="font-rubik" style={{ marginLeft: '1rem', fontSize: '0.8rem', marginTop: '2rem'}}>Ingrese su email</Form.Label>
                        <Form.Control type="email" placeholder="ejemplo.gmail.com" style={{ width:'80%', borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                        
                        <div className="d-flex justify-content-end" style={{marginTop: '2rem'}}>
                            <SendButton text="Enviar Mail" />
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default ForgotPasswordCard;