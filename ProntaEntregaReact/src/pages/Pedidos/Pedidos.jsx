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
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='pedido-list'>
                    {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                        sortedPedidos.map(pedido => (
                            <GenericCard
                                key={pedido.id_pedido}
                                titulo={`Pedido ${pedido.id_pedido}`}
                                descrip1={`Fecha Inicio: ${pedido.fechainicio ? pedido.fechainicio.split('-').reverse().join('/') : ''} ${pedido.horainicio}`}
                                descrip2={`Fecha Vencimiento: ${pedido.fechavencimiento ? pedido.fechavencimiento.split('-').reverse().join('/') : ''} ${pedido.horavencimiento}`}
                                // Puedes agregar más detalles del pedido según la estructura de datos
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
