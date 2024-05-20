import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


const LoginNavbar = () => {
    return (
        <Navbar id="login-navbar" expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>Navbar scroll</Navbar.Brand>
        </Container>
      </Navbar>
    );
};

export default LoginNavbar;