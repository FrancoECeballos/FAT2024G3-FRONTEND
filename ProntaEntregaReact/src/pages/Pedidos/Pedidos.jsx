import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx'; // Importa tu componente genérico de tarjeta
import fetchData from '../../functions/fetchData';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('/pedido/', token).then((result) => {
            setPedidos(result);
        }).catch(error => {
            console.error('Error fetching orders:', error);
        });
    }, [token, navigate]);

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <h2>Pedidos</h2>
                <div className='pedido-list'>
                    {Array.isArray(pedidos) && pedidos.length > 0 ? (
                        pedidos.map(pedido => (
                            <GenericCard
                                key={pedido.id_pedido}
                                titulo={`Pedido ${pedido.id_pedido}`}
                                descrip1={`Fecha Inicio: ${pedido.fechainicio} ${pedido.horainicio}`}
                                descrip2={`Fecha Vencimiento: ${pedido.fechavencimiento} ${pedido.horavencimiento}`}
                                // Puedes agregar más detalles del pedido según la estructura de datos
                            />
                        ))
                    ) : (
                        <p>No hay pedidos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pedidos;
