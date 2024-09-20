import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { Container, Nav, Navbar, Offcanvas, Dropdown, Modal, Button } from 'react-bootstrap';
import fetchData from '../../../functions/fetchData';

import whiteLogo from '../../../assets/WhiteLogo.png';
import blueLogo from '../../../assets/BlueLogo.png';

import NotificationCard from '../../notifications/notification_card/NotificationCard';
import GenericModal from '../../modals/Modal';

import './FullNavbar.scss';

function FullNavbar({ selectedPage }) {
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

  const handleMarkAsRead = () => {
    fetchData(`/MarkNotificacionAsRead/${selectedNotification.notificacion_id}`, token).then(() => {
      setShowModal(false);
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  }

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

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const [notificationByUser, setNotificationByUser] = useState([]);

  const handleSuperUserAuth = async (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
  
    if (data.is_superuser || token) {
      if (currentPath === '/perfil/micuenta') {
        navigate('/perfil/micuenta');
        window.location.reload();
      } else {
        navigate('/perfil/micuenta');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Navbar expand={expand} className="full-navbar">
      <Container fluid className="navbar-container">
        <Navbar.Brand>
          <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
        </Navbar.Brand>

        <Nav className="nav-link">
          <Nav.Link className='naving' onClick={() => navigate('/novedades')}>
            <span className="nav-text">{selectedPage === 'Novedades' ? <strong>Novedades</strong> : 'Novedades'}</span>
          </Nav.Link>
          <Nav.Link className='naving' onClick={() => navigate('/stock')}>
            <span className="nav-text">{selectedPage === 'Stock' ? <strong>Stock</strong> : 'Stock'}</span>
          </Nav.Link>
          <Nav.Link className='naving' onClick={() => navigate('/pedidos')}>
            <span className="nav-text">{selectedPage === 'Pedidos' ? <strong>Pedidos</strong> : 'Pedidos'}</span>
          </Nav.Link>
          <Nav.Link className='naving' onClick={() => navigate('/oferta')}>
            <span className="nav-text">{selectedPage === 'Ofertas' ? <strong>Ofertas</strong> : 'Ofertas'}</span>
          </Nav.Link>
          <Nav.Link className='naving' onClick={() => navigate('/entregas')}>
            <span className="nav-text">{selectedPage === 'Entregas' ? <strong>Entregas</strong> : 'Entregas'}</span>
          </Nav.Link>
          <Nav.Link className='naving' onClick={() => navigate('/vehiculos')}>
            <span className="nav-text">{selectedPage === 'Autos' ? <strong>Vehículos</strong> : 'Vehículos'}</span>
          </Nav.Link>
        </Nav>

        <div className='botons-derecha'>
          <Dropdown align="end">
            <Dropdown.Toggle as="div" id="dropdown-custom-components">
              {notificationByUser.length >= 1 ? (
                <Icon icon="line-md:bell-alert-loop" style={{ width: '2rem', height: '2rem', color: '#02005E' }} />
              ) : (
                <Icon icon="line-md:bell-loop" style={{ width: '2rem', height: '2rem', color: '#02005E' }} />
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="custom-dropdown-menu">
              {notificationByUser.length >= 1 ? (
                notificationByUser.map((notification, index) => (
                  <Dropdown.Item
                    key={notification.id || index}
                    onClick={() => { handleNotificationClick(notification); }}
                    className="custom-dropdown-item"
                  >
                    <NotificationCard titulo={notification.titulo} info={notification.descripcion} />
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item className="custom-dropdown-item">
                  <div>No hay notificaciones</div>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Icon icon="line-md:account" style={{ width: '2rem', height: '2rem', marginRight: '0.3rem', marginLeft: '0.3rem', color: '#02005E' }} onClick={handleSuperUserAuth} />
          <Icon icon="line-md:menu" style={{ width: '2rem', height: '2rem', marginRight: '0.3rem', marginLeft: '0.2rem', color: '#02005E' }} onClick={handleShowOffcanvas} />
        </div>

        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          placement="end"
          style={{ backgroundColor: 'white', color: 'white' }}
        >
          <Offcanvas.Header closeButton>
            <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
            <Offcanvas.Title style={{ color: "#02005E", marginLeft: 'auto', marginRight: 'auto' }}>Menú</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body style={{ display: "flex", height: "100%" }}>
            <Nav className="justify-content-center flex-grow-1 pe-3">
              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={handleSuperUserAuth}>
                <Icon icon="line-md:account" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={handleSuperUserAuth}>Mi Cuenta</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/novedades')}>
                <Icon icon="line-md:lightbulb" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/novedades')}>Novedades</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/stock')}>
                <Icon icon="line-md:clipboard-list" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/stock')}>Stock</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/pedidos')}>
                <Icon icon="line-md:text-box" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/pedidos')}>Pedidos</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/ofertas')}>
                <Icon icon="line-md:upload-outline" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/oferta')}>Ofertas</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'left', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/entregas')}>
                <Icon icon="line-md:telegram" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/entregas')}>Entregas</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'left', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/vehiculos')}>
                <Icon icon="line-md:speed" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/autos')}>Vehículos</Nav.Link>
              </div>

              <div className='hoverable-off-canvas' style={{ display: 'flex', alignItems: 'center', marginLeft: "30%", color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/obras')}>
                <Icon icon="line-md:home-md" style={{ width: "2rem", height: "2rem", marginRight: "0.2rem" }} />
                <Nav.Link onClick={() => navigate('/obras')}>Obras</Nav.Link>
              </div>

              <div className='hoverable-off-canvas-cerrarsesion' style={{ position: 'absolute', bottom: '0.4rem', right: '0.6rem', color: '#D9D9D9', fontWeight:"bold"}}>
                <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;