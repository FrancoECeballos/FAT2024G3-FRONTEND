import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../assets/Logo.png';
import './FullNavbar.scss';
import side from '../../../assets/side_bar.png';

function FullNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar expand={true} className="full-navbar" id="base-navbar">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        <Nav className="mx-auto">
        <div className="vertical-divider"></div>
          <Nav.Link href="#novedades" className="nav-link">Novedades</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#stock" className="nav-link">Stock</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#entregas" className="nav-link">Entregas</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#pedidos" className="nav-link">Pedidos</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link href="#ofertas" className="nav-link">Ofertas</Nav.Link>
          <div className="vertical-divider"></div>
        </Nav>
        <Button className="side-button" onClick={handleShow}>
          <img src={side} alt="side" className="side-icon" />
        </Button>

        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ backgroundColor: '#A11818', color: 'white' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
      <div className="vertical-divider"></div>
        <Nav.Link href="#novedades" style={{ color: 'white' }}>Novedades</Nav.Link>
        <div className="vertical-divider"></div>
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

