import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import fetchData from '../../../functions/fetchData';

import whiteLogo from '../../../assets/WhiteLogo.png';
import blueLogo from '../../../assets/BlueLogo.png';
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
  }, []);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

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
            <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
          </Navbar.Brand>  
        </div>
        <div>
          <Nav className="nav-link">
            <Nav.Link className='naving'>Novedades</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/stock')}>Stock</Nav.Link>
            <Nav.Link className='naving'> Entregas</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/pedidos')}> Pedidos</Nav.Link>
            <Nav.Link className='naving'> Ofertas</Nav.Link>
          </Nav>
        </div>
        <div className='botons-derecha'>
          <Navbar.Brand href="#">
            <Icon icon="gala:bell" style={{ width: '2rem', height: '2rem' , marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}}/>
          </Navbar.Brand>  
          <Navbar.Brand href="#">
            <Icon icon="uil:user" style={{ width: '2rem', height: '2rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleSuperUserAuth}/>
          </Navbar.Brand>  
        
        
          <Icon icon="heroicons:bars-3" style={{ width: '3rem', height: '3rem', color: 'black', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleShowOffcanvas} />
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