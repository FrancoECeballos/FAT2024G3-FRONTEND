import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { Container, Nav, Navbar, Offcanvas, Dropdown, Modal, Button } from 'react-bootstrap';
import fetchData from '../../../functions/fetchData';

import whiteLogo from '../../../assets/WhiteLogo.png';
import blueLogo from '../../../assets/BlueLogo.png';
import noti from '../../../assets/notification_bell.png';
import user from '../../../assets/user_in_app.png';

import NotificationCard from '../../notifications/notification_card/NotificationCard';
import GenericModal from '../../modals/Modal';

import './FullNavbar.scss';

function FullNavbar() {
  const [show, setShow] = useState(false);
  const expand = false; 
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = Cookies.get('token');

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        fetchData(`/userToken/${token}`).then((result) => {
          setData(result);
          return fetchData(`/getNotificacion/${result.id_usuario}`, token);
        }).then((notificationResult) => {
          setNotificationByUser(notificationResult);
        }).catch((error) => {
          console.error(error);
        });
      }
    };
    fetchUserData();
  }, [token]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const [notificationByUser, setNotificationByUser] = useState([]);

  const handleSuperUserAuth = async (e) => {
    e.preventDefault();
    if (data.is_superuser) {
      navigate('/perfil/micuenta');
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
            <Nav.Link className='naving' onClick={() => navigate('/novedades')}>Novedades</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/stock')}>Stock</Nav.Link>
            <Nav.Link className='naving'>Entregas</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/pedidos')}>Pedidos</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/oferta')}>Ofertas</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/autos')}>Autos</Nav.Link>
          </Nav>
        <div className='botons-derecha'>
          <Navbar.Brand>
            <Dropdown align="end">
              <Dropdown.Toggle as="div" id="dropdown-custom-components">
              {notificationByUser.length >= 1 ? (
                <Icon icon="line-md:bell-alert-loop" style={{ width: '2rem', height: '2rem', color: '#02005E' }}/>
              ) : (
                <Icon icon="line-md:bell-loop" style={{ width: '2rem', height: '2rem', color: '#02005E' }}/>
              )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notificationByUser.map((notification, index) => (
                  <Dropdown.Item key={notification.id || index} onClick={() => handleNotificationClick(notification)}>
                    <NotificationCard titulo={notification.titulo} info={notification.descripcion} />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Brand>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedNotification?.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{selectedNotification?.descripcion}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleCloseModal}>
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>

          <Navbar.Brand>
          <Icon icon="uil:user" style={{ width: '2rem', height: '2rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleSuperUserAuth}/>
          </Navbar.Brand>  
          <Navbar.Brand>
            <Icon icon="heroicons:bars-3" style={{ width: '3rem', height: '3rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E' }} onClick={handleShowOffcanvas} />
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
