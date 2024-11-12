import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericTable from '../../components/tables/generic_table/GenericTable.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import Loading from '../../components/loading/loading.jsx';

import fetchUser from '../../functions/fetchUser.jsx';
import fetchData from '../../functions/fetchData.jsx';
import './InformePedidos.scss';


const InformePedidos = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [pedidos, setPedidos] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const userData = await fetchUser(navigate);

            if (!userData) {
                navigate('/login');
            } 
            if (!userData.is_superuser) {
                navigate('/pedidos');
            }

            fetchData('pedido/', token).then(data => {
                setPedidos(data);
                setIsLoading(false);
            });
        };

        fetchUserData();
    }, []);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleOrderChange = (order) => {
        setOrder(order);
    };

    const filteredData = pedidos.filter(pedido => {
        const fullName = `${pedido.id_usuario.nombre} ${pedido.id_usuario.apellido}`;
        return (
            pedido.id_producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.fechainicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.fechavencimiento.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.id_obra.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.id_estadoPedido.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.cantidad.toString().includes(searchQuery)
        );
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!order) return 0;
        const [key, direction] = order.split(' ');
        const aValue = key.includes('+') ? key.split('+').map(part => part.trim()).map(part => part.split('.').reduce((acc, key) => acc && acc[key], a)).join(' ') : key.split('.').reduce((acc, key) => acc && acc[key], a);
        const bValue = key.includes('+') ? key.split('+').map(part => part.trim()).map(part => part.split('.').reduce((acc, key) => acc && acc[key], b)).join(' ') : key.split('.').reduce((acc, key) => acc && acc[key], b);
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (isLoading) {
        return <div><FullNavbar /><Loading /></div>;
    }

    return (
        <div>
            <FullNavbar selectedPage='Pedidos'/>
            <div>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip style={{ fontSize: '100%' }}>Volver a Pedidos</Tooltip>}
                >
                    <Icon className="hoverable-icon" style={{ width: "2.5rem", height: "2.5rem", color: "#858585", marginTop: '1rem', marginLeft: '1rem', transition: "transform 0.3s" }} 
                        icon="line-md:chevron-left" onClick={() => navigate('/pedidos')}/>
                </OverlayTrigger>
            </div>
            <h1>Esta es una lista de todos los Pedidos</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SearchBar 
                    onSearchChange={handleSearchChange} 
                    onOrderChange={handleOrderChange} 
                    filters={[
                        { type: 'id_pedido asc', label: 'ID' },
                        { type: 'id_producto.nombre asc', label: 'Orden del Producto' },
                        { type: 'fechainicio asc', label: 'Fecha de Inicio' },
                        { type: 'fechavencimiento asc', label: 'Fecha de Vencimiento' },
                        { type: 'id_usuario.nombre + id_usuario.apellido asc', label: 'Nombre del Usuario' },
                        { type: 'id_obra.nombre asc', label: 'Nombre de la Obra' },
                        { type: 'id_estadoPedido.id_estadoPedido asc', label: 'Estado del Pedido' },
                        { type: 'cantidad asc', label: 'Cantidad Pedida' },
                    ]}
                    style={{ width: '80rem' }}
                />
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {sortedData.length === 0 ? (
                    <p style={{ marginTop: '1rem' }}>No hay pedidos disponibles.</p>
                    ) : (
                    <div className="table-container">
                        <GenericTable 
                        headers={['id_pedido', 'id_producto.imagen', 'id_producto.nombre', 'fechainicio', 'fechavencimiento', 'id_obra.nombre', 'id_usuario.nombre + id_usuario.apellido', 'id_estadoPedido.nombre', 'cantidad']} 
                        shownHeaders={['#', 'Imagen', 'Producto', 'Fecha de Inicio', 'Fecha de Vencimiento', 'Obra', 'Usuario', 'Estado', 'Cantidad Pedida']} 
                        data={sortedData} 
                        showCreateNew={false} 
                        createNewFunction={() => {}} 
                        minWid='80rem'
                        maxWid='80rem' 
                        />
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformePedidos;