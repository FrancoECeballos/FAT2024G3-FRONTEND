import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import "./FullNavbar.scss";

import Logo from '../../../assets/Logo.png';
import NotifBell from '../../../assets/notification_bell.png';
import UserInApp from '../../../assets/user_in_app.png';
import SideBar from '../../../assets/side_bar.png';

import { useNavigate } from 'react-router-dom';

export default function FullNavbar({}) {

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Navbar 
			id="base-navbar" 
			expand="lg" 
			fixed="top" 
			style={{ backgroundColor: '#A11818', color: 'white' }}
		>
			<Container fluid>
				<Navbar.Brand>
					<a href="login.html">
						<img src={Logo} alt='Logo' id='logo' style={{ width: '4rem' }} />
					</a>
				</Navbar.Brand>
				<Nav className="me-auto">
					<div className="pages-nav">
						<div className="vertical-divider"></div>
						<Nav.Link className="white" href="#home">Novedades</Nav.Link>
						<div className="vertical-divider"></div>
						<Nav.Link className="white" href="#link">Stock</Nav.Link>
						<div className="vertical-divider"></div>
						<Nav.Link className="white" href="#link">Entregas</Nav.Link>
						<div className="vertical-divider"></div>
						<Nav.Link className="white" href="#link">Pedidos</Nav.Link>
						<div className="vertical-divider"></div>
						<Nav.Link className="white" href="#link">Ofertas</Nav.Link>
						<div className="vertical-divider"></div>
					</div>
				</Nav>
				<Nav style={{width: '20%'}}>
					<img src={NotifBell} style={{width: '2.5rem', marginRight:'5rem'}}/>
					<img src={UserInApp} style={{width: '2.5rem', marginRight:'5rem'}}/>
					<Button onClick={handleShow} style={{width: '2.5rem', paddingRight:'10rem'}}>
						<img src={SideBar} style={{width:'2.5rem'}}/>
					</Button>

					<Offcanvas show={show} onHide={handleClose} backdrop="static">
						<Offcanvas.Header closeButton>
						<Offcanvas.Title>Offcanvas</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
						I will not close if you click outside of me.
						</Offcanvas.Body>
					</Offcanvas>
				</Nav>
            </Container>
        </Navbar>
    );
};
