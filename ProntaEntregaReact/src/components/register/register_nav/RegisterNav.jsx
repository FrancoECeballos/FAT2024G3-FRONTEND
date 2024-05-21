import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../../assets/Logo.png';

const RegisterNavbar = () => {
    return (
        <Navbar 
            id="register-navbar" 
            expand="lg" 
            fixed="top" 
            style={{ backgroundColor: '#A11818', color: 'white' }}
        >
            <Container fluid>
                <Navbar.Brand>
                    <a href="login.html">
                        <img src={Logo} alt='Logo' id='logo' style={{ width: '4rem' }} />
                    </a>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default RegisterNavbar;
