import React from 'react';
import { useState, useEffect } from 'react'
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar';
import ControlledCarousel from '../../components/carrusel/carrusel';
import GenericTabs from '../../components/tabs/tabs';
import GenericTab from '../../components/tabs/tab/tab.jsx';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';


function Landing (){
 
  return (
    <div>
        <BaseNavbar/>
        <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3}/>
        <GenericTabs>
          <GenericTab nombre='Home' titulo='Bienvenido a Pronta Entrega' sub='La mejor tienda de ropa de la ciudad'/>
          <GenericTab nombre='Productos' titulo='Productos' sub='Encuentra la mejor ropa en Pronta Entrega'/>
          <GenericTab nombre='Contacto' titulo='Contacto' sub='Contactanos para mas informacion'/>
        </GenericTabs>
    </div>
  );
};
export default Landing;