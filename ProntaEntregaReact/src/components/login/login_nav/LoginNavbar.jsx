import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../../assets/Logo.png';

const LoginNavbar = () => {
    return (
        <Navbar id="login-navbar" expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand></Navbar.Brand>
          <img src={Logo} alt='' id='logo' style={{ width: '4rem',}}/>
        </Container>
      </Navbar>
    );
};

export default LoginNavbar;