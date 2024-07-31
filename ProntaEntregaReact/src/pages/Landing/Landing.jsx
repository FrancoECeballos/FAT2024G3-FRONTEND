import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar.jsx';
import ControlledCarousel from '../../components/carrusel/carrusel.jsx';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';
import './Landing.scss';


function Landing (){
 
  return (
    <div>
      <BaseNavbar children={
        <div>
          <Button 
            style={{  
                borderRadius:'1rem', 
                textAlign:'center',
                width: `7rem`, 
                backgroundColor: 'blue', 
                borderColor:'white', 
                color:`white`,
                marginRight: '2rem', 
            }} 
            variant="primary" 
            type="submit"
        >
          Ingresar
        </Button>
        </div>
      }/>
      <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3}/>
      <div style={{textAlign:'center',fontFamily: ''}}>
        <h1 style={{fontSize: '5rem'}}>¿Que es pronta entrega?</h1>
        <p style={{fontSize: '2rem'}}>
          Pronta Entrega busca brindar una forma de contactar a las 
          <br/>
          casas para distribuir recursos y agilizar la administración de estos materiales.
        </p>
        <br/>
        <br/>
        <h1 style={{fontSize: '5rem'}}>¿Quienes somos?</h1>
        <p style={{fontSize: '2rem'}}></p>
        </div>
        <br/>
        <br/>
        <Tabs defaultActiveKey="profile" id="fill-tab-example" className="mb-3" fill>
        <Tab eventKey="home" title="Stock">
        <h1>Stock</h1>
        <p>
        Se proporcionará un sistema de registro del stock rápido y sencillo de utilizar para que los voluntarios puedan visualizar los recursos de sus casas, 
        ingresar cambios fácilmente y recibir notificaciones en caso de exceso o escasez de un producto</p>
        </Tab>
        <Tab eventKey="profile" title="Pedidos">
        <h1>Pedidos</h1>
        <p>
        Basado en el sistema anterior, si se necesita o se tiene demasiado de un producto, un voluntario puede crear un pedido o una oferta que será vista por los integrantes de todas las casas. 
        Este podrá ser tomado, lo que lo llevará al último apartado</p>
        </Tab>
        <Tab eventKey="longer-tab" title="Envios">
        <h1>Envios</h1>
        <p>
        Cuando se reclama un pedido o una oferta, los voluntarios podrán acordar la fecha de entrega y la forma del traslado.
        Finalmente, proporcionaremos una forma de almacenar los vehículos a disposición de la organización.</p>
        </Tab>
        </Tabs>
    </div>
  );
};
export default Landing;