import React, { useState } from 'react';
import {Container, Button, Nav, Navbar, Offcanvas} from 'react-bootstrap';

import logo from '../../../assets/Logo.png';
import side from '../../../assets/side_bar.png';
import noti from '../../../assets/notification_bell.png';
import  user from '../../../assets/user_in_app.png';

import './FullNavbar.scss';

function FullNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar expand={true} className="full-navbar" id="base-navbar">
      <Container>
        <div className='botons-izq'>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        </div>
        <Nav>
        <div className="vertical-divider"></div>
          <Nav.Link href="#novedades" className="nav-link" style={{alignContent: 'center'}}>Novedades</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#stock" className="nav-link"  style={{alignContent: 'center'}}>Stock</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#entregas" className="nav-link" style={{alignContent: 'center'}}>Entregas</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#pedidos" className="nav-link" style={{alignContent: 'center'}}>Pedidos</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#ofertas" className="nav-link" style={{alignContent: 'center'}}>Ofertas</Nav.Link>
          <div className="vertical-divider"></div>
        </Nav>
        <div className='botons-derecha'>
        <Navbar.Brand href="#home">
          <img src={noti} alt="Noti" className="noti" style={{ width: '3rem' }} />
        </Navbar.Brand>
        <Navbar.Brand href="#home">
          <img src={user} alt="User" className="user" style={{ width: '3rem' }}  />
        </Navbar.Brand>
        <Button className="side-button" onClick={handleShow}>
          <img src={side} alt="side" className="side-icon" />
        </Button>
        </div>

        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ backgroundColor: '#A11818', color: 'white' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav.Link href="#novedades" style={{ color: 'white' }}>Novedades</Nav.Link>
        <Nav.Link href="#stock" style={{ color: 'white' }}>Stock</Nav.Link>
        <Nav.Link href="#entregas" style={{ color: 'white' }}>Entregas</Nav.Link>
        <Nav.Link href="#pedidos" style={{ color: 'white' }}>Pedidos</Nav.Link>
        <Nav.Link href="#ofertas" style={{ color: 'white' }}>Ofertas</Nav.Link>
      </Offcanvas.Body>
    </Offcanvas>
  </Container>
</Navbar>
);
}

export default FullNavbar;

