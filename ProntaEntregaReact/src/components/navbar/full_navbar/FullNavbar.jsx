import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../assets/Logo.png';
import './FullNavbar.scss';

function FullNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
        
    <Navbar expand={true} className="full-navbar"
    id="base-navbar"  
        style={{ backgroundColor: '#A11818', color: 'white' }}>
      
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" style={{width: '4rem'}} />
        </Navbar.Brand>
        <Nav>
            <div className="vertical-divider"></div>
            <Nav.Link href="#novedades" style={{ color: 'white' }}>Novedades</Nav.Link>
            <div className="vertical-divider"></div>
            <Nav.Link href="#stock" style={{ color: 'white' }}>Stock</Nav.Link>
            <div className="vertical-divider"></div>
            <Nav.Link href="#entregas" style={{ color: 'white' }}>Entregas</Nav.Link>
            <div className="vertical-divider"></div>
            <Nav.Link href="#pedidos" style={{ color: 'white' }}>Pedidos</Nav.Link>
            <div className="vertical-divider"></div>
            <Nav.Link href="#ofertas" style={{ color: 'white' }}>Ofertas</Nav.Link>
            <div className="vertical-divider"></div>
            

            <Button style={{width: '5rem'}} variant="primary" onClick={handleShow}>
              Launch
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
              </Offcanvas.Body>
            </Offcanvas>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;
