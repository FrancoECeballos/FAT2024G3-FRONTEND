import React from 'react';
import { useState, useEffect } from 'react'
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar.jsx';
import ControlledCarousel from '../../components/carrusel/carrusel.jsx';
import GenericTabs from '../../components/tabs/tabs.jsx';
import GenericTab from '../../components/tabs/tab/tab.jsx';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';


function Landing (){
 
  return (
    <div>
        <BaseNavbar/>
        <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3}/>
        <div style={{textAlign:'center',fontFamily: ''}}>
        <h1 style={{fontSize: '5rem'}}>¿Que es pronta entrega?</h1>
        <p style={{fontSize: '2rem', }}>Pronta Entrega busca brindar una forma de contactar a las casas para distribuir recursos y agilizar la administración de estos materiales.</p>
        </div>
    </div>
  );
};
export default Landing;