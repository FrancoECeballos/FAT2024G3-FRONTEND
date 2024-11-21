import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import Loading from '../../components/loading/loading.jsx';
import BackButton from '../../components/buttons/back_button/back_button.jsx'

import fetchUser from '../../functions/fetchUser.jsx';
import fetchData from '../../functions/fetchData.jsx';
import './Informes.scss';
const InformeOfertas = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);
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
                navigate('/oferta');
            }

            fetchData('/oferta_all/', token).then(data => {
                setOfertas(data);
                setIsLoading(false);
            });
        };

        fetchUserData();
    }, [navigate, token]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleOrderChange = (order) => {
        setOrder(order);
    };

    const filteredData = ofertas.filter(oferta => {
        const fullName = `${oferta.id_usuario.nombre} ${oferta.id_usuario.apellido}`;
        return (
            oferta.id_producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechainicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechavencimiento.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_obra.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_estadoOferta.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.cantidad.toString().includes(searchQuery)
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
            <FullNavbar selectedPage='/Ofertas' />
            <BackButton />
            <h1 style={{ marginTop: "1rem" }}>Esta es una lista de todas las Ofertas</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SearchBar
                    onSearchChange={handleSearchChange}
                    onOrderChange={handleOrderChange}
                    filters={[
                        { type: 'id_oferta asc', label: 'ID' },
                        { type: 'id_producto.nombre asc', label: 'Orden del Producto' },
                        { type: 'fechainicio asc', label: 'Fecha de Inicio' },
                        { type: 'fechavencimiento asc', label: 'Fecha de Vencimiento' },
                        { type: 'id_usuario.nombre + id_usuario.apellido asc', label: 'Nombre del Usuario' },
                        { type: 'id_obra.nombre asc', label: 'Nombre de la Obra' },
                        { type: 'id_estadoOferta.id_estadoOferta asc', label: 'Estado de la Oferta' },
                        { type: 'cantidad asc', label: 'Cantidad Ofrecida' },
                    ]}
                    style={{ width: '80rem' }}
                />
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {sortedData.length === 0 ? (
                        <p style={{ marginTop: '1rem' }}>No hay ofertas disponibles.</p>
                    ) : (
                        <div className="table-container">
                            <table className="generic-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Imagen</th>
                                        <th>Producto</th>
                                        <th>Fecha de Inicio</th>
                                        <th>Fecha de Vencimiento</th>
                                        <th>Obra</th>
                                        <th>Usuario</th>
                                        <th>Estado</th>
                                        <th>Cantidad Ofrecida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.map((oferta, index) => (
                                        <tr key={oferta.id}>
                                            <td>{oferta.id_oferta}</td>
                                            <td><img src={oferta.id_producto.imagen} alt={oferta.id_producto.nombre} style={{ width: '50px', height: '50px' }} /></td>
                                            <td>{oferta.id_producto.nombre}</td>
                                            <td>{oferta.fechainicio}</td>
                                            <td>{oferta.fechavencimiento}</td>
                                            <td>{oferta.id_obra.nombre}</td>
                                            <td>{`${oferta.id_usuario.nombre} ${oferta.id_usuario.apellido}`}</td>
                                            <td>{oferta.id_estadoOferta.nombre}</td>
                                            <td>{oferta.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformeOfertas;