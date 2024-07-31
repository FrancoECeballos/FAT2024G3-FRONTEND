import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import putData from '../../functions/putData.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

function AutosComponent() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [autos, setAutos] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('/transporte/', token).then((result) => {
            setAutos(result);
        }).catch(error => {
            console.error('Error fetching autos:', error);
        });
    }, [token, navigate]);

    const filteredAutos = autos.filter(auto => {
        return (
            auto.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.patente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.kilometraje?.toString().includes(searchQuery) ||
            auto.anio?.toString().includes(searchQuery)
        );
    });

    const sortedAutos = [...filteredAutos].sort((a, b) => {
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
        { type: 'marca', label: 'Marca' },
        { type: 'modelo', label: 'Modelo' },
        { type: 'patente', label: 'Patente' },
        { type: 'kilometraje', label: 'Kilometraje' },
        { type: 'anio', label: 'Año' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <h2 style={{marginLeft: '7rem'}}>Lista de Autos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='auto-list'>
                    {Array.isArray(sortedAutos) && sortedAutos.length > 0 ? (
                        sortedAutos.map(auto => (
                            <GenericCard
                                key={auto.id_transporte}
                                foto={auto.imagen}
                                titulo={<><strong>Marca:</strong> {auto.marca} - <strong>Modelo:</strong> {auto.modelo}</>}
                                descrip1={<><strong>Patente:</strong> {auto.patente}</>}
                                descrip2={<><strong>Kilometraje:</strong> {auto.kilometraje} km</>}
                                children={
                                    <SendButton text='Solicitar Mantenimiento' backcolor='#3E4692' letercolor='white' 
                                    onClick={putData(`editar_transporte/${auto.id_transporte}/`,)}/>
                                }
                            />
                        ))
                    ) : (
                        <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay autos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AutosComponent;
