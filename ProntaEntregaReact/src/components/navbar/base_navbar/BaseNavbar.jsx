import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';


import Logo from '../../../assets/Logo.png';

export default function BaseNavbar({}) {
    const navigate = useNavigate();
    return (
        <Navbar 
            id="base-navbar" 
            expand="sm" 
            fixed="top" 
            style={{ backgroundColor: '#A11818', color: 'white' }}
        >
            <Container fluid>
                <Navbar.Brand>
                    <a>
                        <img src={Logo} alt='Logo' id='logo' style={{ width: '4rem' }} onClick={() => navigate('/')} />
                    </a>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};