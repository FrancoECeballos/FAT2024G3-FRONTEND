import React from 'react';
import { useState, useEffect } from 'react'
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar';
import ControlledCarousel from '../../components/carrusel/carrusel';
import FillExample from '../../components/tabs/tabs';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';


function Landing (){
 
  return (
    <div>
        <BaseNavbar/>
        <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3}/>
        <FillExample titulo1={'Stock'} titulo2={'Pedidos'} titulo3={'Envios'} />
    </div>
  );
};
export default Landing;