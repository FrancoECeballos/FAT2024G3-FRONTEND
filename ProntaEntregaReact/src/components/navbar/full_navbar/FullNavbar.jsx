import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../assets/Logo.png';
import './FullNavbar.scss';

function OffcanvasExample() {
  const expand = false; // Usamos el primer valor del array original

  return (
        
    <Navbar expand={expand} className="full-navbar"
    id="base-navbar"  
        style={{ backgroundColor: '#A11818', color: 'white' }}>
      
      <Container fluid>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" className="navbar-logo" />
          
        </Navbar.Brand>
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

        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end">
          
          <Offcanvas.Header closeButton>
          <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body
           style={{ backgroundColor: '#A11818', color: 'white' }}>
          <Nav className="mx-auto">
              <Nav.Link href="#novedades" style={{ color: 'white' }}>Novedades</Nav.Link>
              <Nav.Link href="#stock" style={{ color: 'white' }}>Stock</Nav.Link>
              <Nav.Link href="#entregas" style={{ color: 'white' }}>Entregas</Nav.Link>
              <Nav.Link href="#pedidos" style={{ color: 'white' }}>Pedidos</Nav.Link>
              <Nav.Link href="#ofertas" style={{ color: 'white' }}>Ofertas</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default OffcanvasExample;
