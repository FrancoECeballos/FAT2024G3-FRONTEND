import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('/oferta/', token).then((result) => {
            setOfertas(result);
        }).catch(error => {
            console.error('Error fetching orders:', error);
        });
    }, [token, navigate]);

    const filteredOfertas = ofertas.filter(oferta => {
        return (
            oferta.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedOfertas = [...filteredOfertas].sort((a, b) => {
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
                <h2 style={{marginLeft: '7rem'}}>Ofertas</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='oferta-list'>
                    {Array.isArray(sortedOfertas) && sortedOfertas.length > 0 ? (
                        sortedOfertas.map(oferta => (
                            <GenericCard
                                key={oferta.id_oferta}
                                titulo={`oferta ${oferta.id_oferta}`}
                                descrip1={`Casa: ${oferta.id_casa.nombre} Usuario: ${oferta.id_usuario.nombre} ${oferta.id_usuario.apellido}`}
                                descrip2={`Estado: ${oferta.id_estadooferta.nombre} Cantidad: ${oferta.cantidad}`}
                                descrip3={`Fecha Inicio: ${oferta.fechainicio ? oferta.fechainicio.split('-').reverse().join('/') : ''} ${oferta.horainicio}`}
                                descrip4={`Fecha Vencimiento: ${oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''} ${oferta.horavencimiento}`}
                            />
                        ))
                    ) : (
                        <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay ofertas disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ofertas;
