import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';
import { Container, Nav, Navbar, Offcanvas, Dropdown, Modal, Button } from 'react-bootstrap';
import fetchData from '../../../functions/fetchData';

import whiteLogo from '../../../assets/WhiteLogo.png';
import blueLogo from '../../../assets/BlueLogo.png';

import NotificationCard from '../../notifications/notification_card/NotificationCard';
import GenericModal from '../../modals/Modal';

import './FullNavbar.scss';

function FullNavbar ({selectedPage}) {
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
          <Navbar.Brand>
            <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
          </Navbar.Brand>  
        </div>

          <Nav className="nav-link">
            <Nav.Link className='naving' onClick={() => navigate('/novedades')}>{selectedPage === 'Novedades' ? <strong>Novedades</strong> : 'Novedades'}</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/stock')}> {selectedPage === 'Stock' ? <strong>Stock</strong> : 'Stock'}</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/pedidos')}>{selectedPage === 'Pedidos' ? <strong>Pedidos</strong> : 'Pedidos'}</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/oferta')}>{selectedPage === 'Ofertas' ? <strong>Ofertas</strong> : 'Ofertas'}</Nav.Link>
            <Nav.Link className='naving'>{selectedPage === 'Entregas' ? <strong>Entregas</strong> : 'Entregas'}</Nav.Link>
            <Nav.Link className='naving' onClick={() => navigate('/autos')}>{selectedPage === 'Autos' ? <strong>Autos</strong> : 'Autos'}</Nav.Link>
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
                {notificationByUser.length >= 1 ? (
                  notificationByUser.map((notification, index) => (
                    <Dropdown.Item
                      key={notification.id || index}
                      onClick={() => handleNotificationClick(notification)}
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
          </Navbar.Brand>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedNotification?.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {selectedNotification?.descripcion}
              </div>
              <div style={{marginTop:"2rem"}}>
                {selectedNotification?.fecha_creacion}
              </div>
            </Modal.Body>
          </Modal>

          <Navbar.Brand>
            <Icon icon="line-md:account" style={{ width: '2rem', height: '2rem', marginRight: '0.7rem', marginLeft: '0.7rem', color: '#02005E'}} onClick={handleSuperUserAuth}/>
          </Navbar.Brand>  
          <Navbar.Brand>
            <Icon icon="line-md:menu" style={{ width: '2rem', height: '2rem', marginRight: '0.7rem', marginLeft: '0.3rem', color: '#02005E' }} onClick={handleShowOffcanvas} />
          </Navbar.Brand>
          <Navbar.Offcanvas
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
            placement="end"
            style={{ backgroundColor: 'white', color: 'white' ,width:"25%"}}
          >
            <Offcanvas.Header closeButton>
              <img src={blueLogo} alt="Logo" className="logo" onClick={() => navigate('/')} />
              <Offcanvas.Title style={{color:"#02005E", marginLeft: 'auto', marginRight: 'auto'}}>Menú</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
              
              <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={handleSuperUserAuth}>
                  <Icon icon="line-md:account" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={handleSuperUserAuth}>Mi Cuenta</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/novedades')}>
                  <Icon icon="line-md:lightbulb" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/novedades')}>Novedades</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/stock')}>
                  <Icon icon="line-md:clipboard-list" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/stock')}>Stock</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/pedidos')}>
                  <Icon icon="line-md:text-box" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/pedidos')}>Pedidos</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/ofertas')}>
                  <Icon icon="line-md:upload-outline" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/ofertas')}>Ofertas</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/entregas')}>
                  <Icon icon="line-md:telegram" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/entregas')}>Entregas</Nav.Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/autos')}>
                  <Icon icon="line-md:speed" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/autos')}>Autos</Nav.Link>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', color: '#02005E', padding: "0.6rem" }} onClick={() => navigate('/casas')}>
                  <Icon icon="line-md:home-md" style={{width:"2rem", height: "2rem", marginRight: "0.2rem"}}/>
                  <Nav.Link onClick={() => navigate('/casas')}>Casas</Nav.Link>
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </div>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;
