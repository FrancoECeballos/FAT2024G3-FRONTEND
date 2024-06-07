import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../assets/Logo.png';
import SideBar from '../../../assets/side_bar.png';
import "./FullNavbar.scss";

export default function FullNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar 
        id="base-navbar" 
        expand="lg" 
        fixed="top" 
        style={{ backgroundColor: '#A11818', color: 'white' }}
      >
        <Container fluid>
          <Navbar.Brand href="#home">
            <img src={logo} alt="Logo" style={{ width: '4rem'}} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
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
            </Nav>
            <Button onClick={handleShow} style={{backgroundColor: 'transparent', border:'none'}}>
              <img src={SideBar} style={{ width: '2.5rem'}}/>
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className=''>Menú Lateral</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav>
            <div>
            <Nav.Link href="#novedades">Novedades</Nav.Link>
	          <Nav.Link href="#stock">Stock</Nav.Link>
            <Nav.Link href="#entregas">Entregas</Nav.Link>
            <Nav.Link href="#pedidos">Pedidos</Nav.Link>
            <Nav.Link href="#ofertas">Ofertas</Nav.Link>
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
