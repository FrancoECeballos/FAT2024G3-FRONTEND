import React from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import './ChangePasswordCard.scss';
import UserDefault from '../../../assets/user_default.png';


const ChangePasswordCard = () => {
    return (
        <Container style={{display: 'flex'}} className="d-flex justify-content-center align-items-center vh-100 change-password-container">
            <Card style={{position: 'relative', width: '50rem',borderRadius:'1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
                <Card.Body>
                    <Form>
                        <h1 className="font-rubik" style={{textAlign:"center",margin:'2.8rem', fontSize: '1.5rem'}}>Cambiar Contraseña</h1>
                        <h2 className="font-rubik" style={{margin:'2.8rem', fontSize: '1.5rem'}}><img src={UserDefault} style={{width: '7rem', marginRight: '1rem'}} />Nombre de Usuario</h2>
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem', marginTop: '2rem'}}>Nueva Contraseña</Form.Label>
                        <Form.Control type="text" style={{ width:'60%', borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' , marginTop: '2rem'}}>Repetir Contraseña</Form.Label>
                        <Form.Control type="text" style={{ width:'60%', borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default ChangePasswordCard;