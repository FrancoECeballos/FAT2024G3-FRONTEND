import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import {Breadcrumb, Form, Col, Row} from 'react-bootstrap';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import GenericCard from '../../components/cards/generic_card/GenericCard';

import fetchData from '../../functions/fetchData.jsx';
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';

import fetchUser from '../../functions/fetchUser.jsx';

const Entregas = () => {
    const [entregas, setEntregas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        fetchData('entrega/', token).then((result) => {
            setEntregas(result);
            console.log(result);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error fetching entregas:', error);
        });
    }, [token, navigate]);

    return (
        <div>
            <FullNavbar selectedPage='Entregas' />
            <div className='margen-arriba'>
                <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                    <Breadcrumb.Item active>Entregas</Breadcrumb.Item>
                </Breadcrumb>
                {isLoading ? (
                    <Loading />
                ) : (
                    <div>
                        {entregas.map((entrega) => {
                            return (
                                <GenericCard
                                    key={entrega.id_entrega}
                                    titulo={entrega.id_pedido === null ? 'Oferta de ' + entrega.id_oferta.id_producto.nombre : 'Pedido de ' + entrega.id_pedido.id_producto.nombre}
                                    descrip1={<><strong>{entrega.id_pedido === null ? 'Ofrecido por la obra:' : 'Pedido por la obra:'}</strong> {entrega.id_pedido === null ? entrega.id_oferta.id_obra.nombre : entrega.id_pedido.id_obra.nombre}</>}
                                    descrip2={<><strong>{entrega.id_pedido === null ? 'Ofrecido por el usuario:' : 'Pedido por el usuario:'}</strong> {entrega.id_pedido === null ? entrega.id_oferta.id_usuario.nombre + ' ' + entrega.id_oferta.id_usuario.apellido
                                         : entrega.id_pedido.id_usuario.nombre + ' ' + entrega.id_pedido.id_usuario.apellido}</>}
                                    descrip3={<><strong>Creado en:</strong> {entrega.id_pedido === null ? entrega.id_oferta.fechainicio : entrega.id_pedido.fechainicio}</>}
                                    foto={entrega.id_pedido === null ? entrega.id_oferta.id_producto.imagen : entrega.id_pedido.id_producto.imagen}
                                    link={`/entregas/${entrega.id}`}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Entregas;