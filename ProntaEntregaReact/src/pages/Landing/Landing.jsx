import React from 'react';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import logo from '../../assets/BlueLogo.png';
import pronta from '../../assets/prontalogo.png';
import stock from '../../assets/stock.png';
import pedidos from '../../assets/envios.png';
import envios from '../../assets/camion.png';
import './Landing.scss';

function Landing() {
    return (
        <div>
            <BaseNavbar children={
                <div style={{ marginRight: '1.5rem' }}>
                    <SendButton text="Ingresar" wide="7" backcolor="#D9D9D9" letercolor="black" id="login" hid={false} shadow='none' href='/login' />
                </div>
            } />
            <header className="masthead">
                <div className="container position-relative">
                    <div className="row justify-content-center">
                        <div className="col-xl-6">
                            <div className="text-center text-white">
                                <h1 className="mb-5 titulo" style={{ color: 'black', fontSize: "4rem", }}>Pronta Entrega</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section className="features-icons bg-light text-center">
                <div className="container">
                    <div className="row" style={{ justifyContent: "space-around" }}>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="features-icons-icon d-flex"><img src={pronta} alt="Responsive Design" /></div>
                                <h3 style={{ marginLeft: "1rem" }}>¿Que es Pronta Entrega?</h3>
                                <p className="lead mb-0">Pronta Entrega es una aplicacion que busca brindar una forma de contactar a las casas para distribuir recursos y agilizar la administración de estos materiales.</p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="container">
                                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                    <div className="features-icons-icon d-flex"><img src={logo} alt="Responsive Design" /></div>
                                    <h3 style={{ marginLeft: "1rem" }}>¿Quienes Somos?</h3>
                                    <p className="lead mb-0">Una fundación de inspiración jesuita abierta a toda persona de buena voluntad. A través del compromiso de voluntarios nos proponemos servir y
                                        promover a los más necesitados mejorando su calidad de vida y suavizando las situaciones de pobreza, dolor y soledad, interviniendo en espacios que están desatendidos e ignorados en la sociedad.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="showcase">
                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-lg-6 order-lg-2 text-white showcase-img"><img src={stock} alt="Responsive Design" className="img-fluid" /></div>
                        <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                            <h2 style={{ marginLeft: "1rem" }}>Stock</h2>
                            <p className="lead mb-0">Se proporcionará un sistema de registro del stock rápido y sencillo de utilizar para que los voluntarios puedan visualizar los recursos de sus casas,
                                ingresar cambios fácilmente y recibir notificaciones en caso de exceso o escasez de un producto</p>
                        </div>
                    </div>
                    <div className="row g-0">
                        <div className="col-lg-6 text-white showcase-img"><img src={pedidos} alt="Responsive Design" className="img-fluid" /></div>
                        <div className="col-lg-6 my-auto showcase-text">
                            <h2 style={{ marginLeft: "1rem" }}>Pedidos</h2>
                            <p className="lead mb-0">Basado en el sistema anterior, si se necesita o se tiene demasiado de un producto, un voluntario puede crear un pedido o una oferta que será vista por los integrantes de todas las casas.
                                Este podrá ser tomado, lo que lo llevará al último apartado</p>
                        </div>
                    </div>
                    <div className="row g-0">
                        <div className="col-lg-6 order-lg-2 text-white showcase-img" ><img src={envios} alt="Responsive Design" className="img-fluid" /></div>
                        <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                            <h2 style={{ marginLeft: "1rem" }}>Envios</h2>
                            <p className="lead mb-0">Cuando se reclama un pedido o una oferta, los voluntarios podrán acordar la fecha de entrega y la forma del traslado.
                                Finalmente, proporcionaremos una forma de almacenar los vehículos a disposición de la organización.</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Landing;