import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [pedidos, setPedidos] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

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

    const filteredPedidos = pedidos.filter(pedido => {
        return (
            pedido.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedPedidos = [...filteredPedidos].sort((a, b) => {
        if (!orderCriteria) return 0;
        const aValue = a[orderCriteria];
        const bValue = b[orderCriteria];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
        }

        return 0;
    });

    const filters = [
        { type: 'fechainicio', label: 'Fecha Inicio' },
        { type: 'fechavencimiento', label: 'Fecha Vencimiento' }
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };


    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <h2 style={{marginLeft: '7rem'}}>Pedidos</h2>
                {/* Botón para navegar a crear_pedido */}
                <button onClick={() => navigate('/crear_pedido')} style={{marginLeft: '7rem', marginBottom: '1rem'}}>Crear Pedido</button>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='pedido-list'>
                    {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                        sortedPedidos.map(pedido => (
                            <GenericCard
                                key={pedido.id_pedido}
                                titulo={`Pedido: ${pedido.id_producto.nombre}`}
                                foto={pedido.id_producto.imagen}
                                descrip1={<><strong>Casa:</strong> {pedido.id_casa.nombre}</>}
                                descrip2={<><strong>Usuario:</strong> {pedido.id_usuario.nombre} {pedido.id_usuario.apellido}</>}
                                descrip3={<><strong>Urgencia:</strong> {pedido.urgente} <strong>Cantidad:</strong> {pedido.cantidad}</>}
                                descrip4={<><strong>Fecha Inicio:</strong> {pedido.fechainicio ? pedido.fechainicio.split('-').reverse().join('/') : ''} {pedido.horainicio}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento ? pedido.fechavencimiento.split('-').reverse().join('/') : ''} {pedido.horavencimiento}</>}
                            />
                        ))
                    ) : (
                        <p style={{marginLeft: '7rem', marginTop: '1rem'}}> No hay pedidos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pedidos;
