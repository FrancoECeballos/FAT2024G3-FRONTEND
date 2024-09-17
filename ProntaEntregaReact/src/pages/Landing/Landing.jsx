import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import ControlledCarousel from '../../components/carrusel/carrusel.jsx';
import { Icon } from '@iconify/react';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';
import './Landing.scss';

function Landing() {
  return (
    <div>
      <BaseNavbar>
        <div style={{ marginRight: '1.5rem' }}>
          <SendButton 
            text="Ingresar" 
            wide="7" 
            backcolor="#D9D9D9" 
            letercolor="black" 
            id="login" 
            hid={false} 
            shadow="none" 
            href="/login" 
          />
        </div>
      </BaseNavbar>
      <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3} />
      <div className="section text-center">
        <h1>¿Qué es Pronta Entrega?</h1>
        <p>
          Pronta Entrega busca brindar una forma de contactar a las obras para distribuir 
          recursos y agilizar la administración de estos materiales.
        </p>
      </div>

      <div className="section text-center">
        <h1>¿Quiénes somos?</h1>
        <p>
          Una fundación de inspiración jesuita abierta a toda persona de buena voluntad. A través 
          del compromiso de voluntarios, nos proponemos servir y promover a los más necesitados, 
          mejorando su calidad de vida y suavizando las situaciones de pobreza, dolor y soledad.
        </p>
      </div>

      <div className="tabs-container">
        <Tabs defaultActiveKey="profile" id="fill-tab-example" className="mb-3" fill>
          <Tab eventKey="home" title="Stock">
            <Icon className="tab-icon" icon="material-symbols:inventory-2-outline" />
            <h1>Stock</h1>
            <p>
              Se proporcionará un sistema de registro del stock rápido y sencillo para que los 
              voluntarios puedan visualizar los recursos de sus obras y recibir notificaciones 
              en caso de exceso o escasez de productos.
            </p>
          </Tab>

          <Tab eventKey="profile" title="Pedidos">
            <Icon className="tab-icon" icon="bi:cart" />
            <h1>Pedidos</h1>
            <p>
              Basado en el sistema anterior, los voluntarios pueden crear pedidos u ofertas que 
              serán vistas por los integrantes de las obras. Este sistema agilizará la gestión de recursos.
            </p>
          </Tab>

          <Tab eventKey="longer-tab" title="Envíos">
            <Icon className="tab-icon" icon="grommet-icons:deliver" />
            <h1>Envíos</h1>
            <p>
              Los voluntarios podrán acordar la fecha de entrega y la forma del traslado, proporcionando 
              una forma de almacenar los vehículos a disposición de la organización.
            </p>
          </Tab>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;
