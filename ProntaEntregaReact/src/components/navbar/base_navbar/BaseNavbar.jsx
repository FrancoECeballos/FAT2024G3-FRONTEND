import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/BlueLogo.png';

export default function BaseNavbar({ children }) {
    const navigate = useNavigate();
    return (
        <Navbar 
            id="base-navbar" 
            expand="sm" 
            fixed="top" 
            style={{ backgroundColor: 'white', color: 'white', position: "relative" }}>

                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                        <Navbar.Brand href="#login">
                            <img src={Logo} alt='Logo' id='logo' style={{ width: '4rem' }} onClick={() => navigate('/landing')} />
                        </Navbar.Brand>
                    </div>
                    <div style={{ display:"flex"}}>
                        {children}
                    </div>
                </div>
        </Navbar>
    );
};