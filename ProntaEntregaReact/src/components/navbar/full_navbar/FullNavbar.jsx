import React, { useEffect, useState } from 'react';
import { Container, Button, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import fetchData from '../../../functions/fetchData';

import logo from '../../../assets/Logo.png';
import side from '../../../assets/side_bar.png';
import noti from '../../../assets/notification_bell.png';
import user from '../../../assets/user_in_app.png';

import './FullNavbar.scss';

function FullNavbar() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchUserData = async () => {
      if (token) {
        const result = await fetchData(`/userToken/${token}`);
        setData(result);
      }
    };
    fetchUserData();
    console.log(data);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSuperUserAuth = () => {
    if (data.is_superuser===true) {
      navigate('/selectuser');
    } else {
      navigate('/perfil/micuenta');
    }
  };

  return (
    <Navbar expand={true} className="full-navbar" id="base-navbar">
      <Container>
        <div className='botons-izq'>
          <Navbar.Brand>
            <img src={logo} alt="Logo" className="logo" onClick={() => navigate('/')} />
          </Navbar.Brand>
        </div>
        <Nav>
          <div className="vertical-divider"></div>
          <Nav.Link className="nav-link" style={{ alignContent: 'center' }}>Novedades</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link className="nav-link" style={{ alignContent: 'center' }} onClick={() => navigate('/stock')}>Stock</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link className="nav-link" style={{ alignContent: 'center' }}>Entregas</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link className="nav-link" style={{ alignContent: 'center' }}>Pedidos</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link className="nav-link" style={{ alignContent: 'center' }}>Ofertas</Nav.Link>
          <div className="vertical-divider"></div>
        </Nav>
        <div className='botons-derecha'>
          <Navbar.Brand>
            <img src={noti} alt="Noti" className="noti" style={{ width: '3rem' }} />
          </Navbar.Brand>
          <Navbar.Brand>
            <img src={user} alt="User" className="user" style={{ width: '3rem' }} onClick={handleSuperUserAuth} />
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
            <Nav.Link style={{ color: 'white' }}>Novedades</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Stock</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Entregas</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Pedidos</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Ofertas</Nav.Link>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;
