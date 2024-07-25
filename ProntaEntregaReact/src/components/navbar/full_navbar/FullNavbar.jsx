import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import { Container, Nav, Navbar, Offcanvas , Dropdown, Button} from 'react-bootstrap';
import fetchData from '../../../functions/fetchData';

import whiteLogo from '../../../assets/WhiteLogo.png';
import blueLogo from '../../../assets/BlueLogo.png';

import './FullNavbar.scss';

function FullNavbar() {
  const [show, setShow] = useState(false);
  const expand = false; 
  const navigate = useNavigate();
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
  }, [token]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleSuperUserAuth = async (e) => {
    e.preventDefault();
    if (data.is_superuser) {
      navigate('/selectuser');
    } else if (token) {
      navigate('/perfil/micuenta');
    } else {
      navigate('/login');
    }
  };

  return (
    <Navbar expand={expand} className="full-navbar">
      <Container fluid>
        <div>
          <Navbar.Brand href="#">
            <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
          </Navbar.Brand>  
        </div>

          <Nav className="nav-link">
            <Nav.Link className='naving'>Novedades</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/stock')}>Stock</Nav.Link>
            <Nav.Link className='naving'>Entregas</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/pedidos')}>Pedidos</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/oferta')}>Ofertas</Nav.Link>
          </Nav>
        <div className='botons-derecha'>
          <Navbar.Brand href="#">
          <Dropdown>
            <Dropdown.Toggle as="div" id="dropdown-custom-components" onClick={() => setShow(!show)}>
              <Icon icon="gala:bell" style={{ width: '2rem', height: '2rem', color: '#02005E' }} />
            </Dropdown.Toggle>

            <Dropdown.Menu show={show}>
              <Dropdown.Item eventKey="1">Acción 1</Dropdown.Item>
              <Dropdown.Item eventKey="2">Acción 2</Dropdown.Item>
              <Dropdown.Item eventKey="3">Acción 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            </Navbar.Brand>  
          <Navbar.Brand href="#">
            <Icon icon="uil:user" style={{ width: '2rem', height: '2rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleSuperUserAuth}/>
          </Navbar.Brand>  
          <Navbar.Brand href="#">
            <Icon icon="heroicons:bars-3" style={{ width: '3rem', height: '3rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleShowOffcanvas} />
          </Navbar.Brand>
          <Navbar.Offcanvas
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
            placement="end"
            style={{ backgroundColor: 'white', color: 'white' }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link style={{ color: '#02005E' }}>Novedades</Nav.Link>
                <Nav.Link style={{ color: '#02005E' }}>Stock</Nav.Link>
                <Nav.Link style={{ color: '#02005E' }}>Entregas</Nav.Link>
                <Nav.Link style={{ color: '#02005E' }}>Pedidos</Nav.Link>
                <Nav.Link style={{ color: '#02005E' }}>Ofertas</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </div>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;
