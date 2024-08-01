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


function Landing (){
 
  return (
    <div>
      <BaseNavbar children={
        <div style={{marginRight:'1.5rem'}}>
          <SendButton text="Ingresar" wide="7" backcolor="#D9D9D9" letercolor="black" id="login" hid={false} shadow='none' href='/login'/>
        </div>
      }/>
      <ControlledCarousel foto1={foto1} foto2={foto2} foto3={foto3}/>
      <br/>
      <div style={{textAlign:'center',fontFamily: '', marginLeft:'10rem',marginRight:'10rem'}}>
        <h1 style={{fontSize: '2.5rem'}}>¿Que es pronta entrega?</h1>
        <p style={{fontSize: '1.25rem'}}>
          Pronta Entrega busca brindar una forma de contactar a las 
          <br/>
          casas para distribuir recursos y agilizar la administración de estos materiales.
        </p>
        </div>
        <br/>
        <br/>
        <div style={{textAlign:'center',fontFamily: '', marginLeft:'15rem',marginRight:'15rem'}}>   
        <h1 style={{fontSize: '2.5rem'}}>¿Quienes somos?</h1>
        <p style={{fontSize: '1.25rem'}}>Una fundación de inspiración jesuita abierta a toda persona de buena voluntad. A través del compromiso de voluntarios nos proponemos servir y
           promover a los más necesitados mejorando su calidad de vida y suavizando las situaciones de pobreza, dolor y soledad, interviniendo en espacios que están desatendidos e ignorados en la sociedad.</p>
        </div>
        <br/>
        <br/>
        <div style={{paddingRight:'30rem',paddingLeft:'30rem'}}>
        <Tabs defaultActiveKey="profile" id="fill-tab-example" className="mb-3" fill>
        <Tab style={{textAlign:'center'}} eventKey="home" title="Stock">
        <Icon style={{width:'10rem', height:'10rem',marginTop:'1.5rem',marginBottom:'1.5rem'}} icon="material-symbols:inventory-2-outline" />
        <h1>Stock</h1>
        <br/>
        <p style={{fontSize: '1.8rem',marginTop:'1rem'}}>
        Se proporcionará un sistema de registro del stock rápido y sencillo de utilizar para que los voluntarios puedan visualizar los recursos de sus casas, 
        ingresar cambios fácilmente y recibir notificaciones en caso de exceso o escasez de un producto</p>
        </Tab>
        <Tab style={{textAlign:'center'}} eventKey="profile" title="Pedidos">
        <Icon style={{width:'10rem', height:'10rem',marginTop:'1.5rem', marginBottom:'1.5rem'}} icon="bi:cart" />
        <h1>Pedidos</h1>
        <p style={{fontSize: '1.8rem',marginTop:'1.5rem'}}>
        Basado en el sistema anterior, si se necesita o se tiene demasiado de un producto, un voluntario puede crear un pedido o una oferta que será vista por los integrantes de todas las casas. 
        Este podrá ser tomado, lo que lo llevará al último apartado</p>
        </Tab>
        <Tab style={{textAlign:'center'}} eventKey="longer-tab" title="Envios">
        <Icon style={{width:'10rem', height:'10rem',marginTop:'1.5rem', marginBottom:'1.5rem'}} icon="grommet-icons:deliver" />
        <h1>Envios</h1>
        <p style={{fontSize: '1.8rem',marginTop:'1.5rem'}}>
        Cuando se reclama un pedido o una oferta, los voluntarios podrán acordar la fecha de entrega y la forma del traslado.
        Finalmente, proporcionaremos una forma de almacenar los vehículos a disposición de la organización.</p>
        </Tab>
        </Tabs>
        </div>
        <Footer/>
    </div>
  );
};
export default Landing;