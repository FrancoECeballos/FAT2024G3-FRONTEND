import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import fetchData from '../../../functions/fetchData';

import logo from '../../../assets/Logo.png';
import noti from '../../../assets/notification_bell.png';
import user from '../../../assets/user_in_app.png';

import './FullNavbar.scss';

function FullNavbar() {
  const expand = false; 
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const token = Cookies.get('token');

  useEffect(() => {
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

  const handleSuperUserAuth = async (e) => {
  e.preventDefault();
  if (data.is_superuser) {
    navigate('/selectuser');
  } else if (token) {
    navigate('/perfil/micuenta');
  }
  else {
    navigate('/login');
  }
  };



  return (
    <Navbar expand={expand} className="full-navbar ">
      <Container fluid>
      <div>
        <Navbar.Brand href="#">
          <img src={logo} alt="Logo" className="logo" onClick={() => navigate('/')} />
          </Navbar.Brand>  
          </div>
          
          <Nav className="nav-link">
          <div className="vertical-divider"></div>
          <Nav.Link style={{ color: 'white' }}>Novedades</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link onClick={() => navigate('/stock')} style={{ color: 'white' }} >Stock</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link style={{ color: 'white' }} > Entregas</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link style={{ color: 'white' }} > Pedidos</Nav.Link>
          <div className="vertical-divider"></div>
          <Nav.Link style={{ color: 'white' }} > Ofertas</Nav.Link>
          <div className="vertical-divider"></div>
          </Nav>
          <div className='botons-derecha'>        
            <Navbar.Brand href="#">
        <img src={noti} alt="Noti" className="noti" style={{ width: '3rem' }} />
          </Navbar.Brand>  
          <Navbar.Brand href="#">
          <img src={user} alt="User" className="user" style={{ width: '3rem' }} onClick={handleSuperUserAuth} />
          </Navbar.Brand>  
        
        
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton style={{ backgroundColor: '#A11818', color: 'white' }}> 
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ backgroundColor: '#A11818', color: 'white' }}>
            <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link style={{ color: 'white' }}>Novedades</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Stock</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Entregas</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Pedidos</Nav.Link>
            <Nav.Link style={{ color: 'white' }}>Ofertas</Nav.Link>
 
            </Nav>
            
            <Form className="d-flex">
            
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        </div>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;