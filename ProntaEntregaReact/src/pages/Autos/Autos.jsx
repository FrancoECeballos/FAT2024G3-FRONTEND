import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

function AutosComponent() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [autos, setAutos] = useState([]);
    const [maintenanceStatus, setMaintenanceStatus] = useState({});

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('/transporte/', token).then((result) => {
            setAutos(result);

            const initialStatus = result.reduce((acc, auto) => {
                acc[auto.id_transporte] = {
                    isMaintained: auto.necesita_mantenimiento,
                    buttonColor: auto.necesita_mantenimiento ? 'green' : '#3E4692',
                    buttonText: auto.necesita_mantenimiento ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
                };
                return acc;
            }, {});
            setMaintenanceStatus(initialStatus);
        }).catch(error => {
            console.error('Error fetching autos:', error);
        });
    }, [token, navigate]);

    const handleMaintenanceRequest = async (id) => {
        const currentStatus = maintenanceStatus[id]?.isMaintained || false;
        const newStatus = !currentStatus;

        setMaintenanceStatus(prevState => ({
            ...prevState,
            [id]: {
                isMaintained: newStatus,
                buttonColor: newStatus ? 'green' : '#3E4692',
                buttonText: newStatus ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
            }
        }));

        try {
            await axios.put(`http://localhost:8000/editar_transporte/${id}/`, 
                { necesita_mantenimiento: newStatus },
                { headers: { 'Authorization': `Token ${token}` } }
            );

            // Actualizar la lista de autos
            setAutos(prevAutos => prevAutos.map(auto =>
                auto.id_transporte === id
                ? { ...auto, necesita_mantenimiento: newStatus }
                : auto
            ));
        } catch (error) {
            console.error('Error updating maintenance status:', error);
            setMaintenanceStatus(prevState => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    isMaintained: currentStatus,
                    buttonColor: currentStatus ? 'green' : '#3E4692',
                    buttonText: currentStatus ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
                }
            }));
        }
    };

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
        if (a.necesita_mantenimiento === b.necesita_mantenimiento) {
            if (orderCriteria) {
                const aValue = a[orderCriteria];
                const bValue = b[orderCriteria];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return bValue - aValue;
                }
            }
            return 0;
        }
        return a.necesita_mantenimiento ? -1 : 1;
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
                <h2 style={{ marginLeft: '7rem' }}>Lista de Autos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='auto-list'>
                    {Array.isArray(sortedAutos) && sortedAutos.length > 0 ? (
                        sortedAutos.map(auto => {
                            const maintenance = maintenanceStatus[auto.id_transporte] || {};
                            const cardStyle = maintenance.isMaintained ? { backgroundColor: 'lightgray' } : {};
                            const imageStyle = maintenance.isMaintained ? { filter: 'grayscale(100%)' } : {};

                            return (
                                <GenericCard
                                    key={auto.id_transporte}
                                    foto={auto.imagen}
                                    titulo={<><strong>Marca:</strong> {auto.marca} - <strong>Modelo:</strong> {auto.modelo}</>}
                                    descrip1={<><strong>Patente:</strong> {auto.patente}</>}
                                    descrip2={<><strong>Kilometraje:</strong> {auto.kilometraje} km</>}
                                    cardStyle={cardStyle}
                                    imageStyle={imageStyle}
                                    children={
                                        <SendButton
                                            text={maintenance.buttonText || 'Solicitar Mantenimiento'}
                                            backcolor={maintenance.buttonColor || '#3E4692'}
                                            letercolor='white'
                                            onClick={() => handleMaintenanceRequest(auto.id_transporte)}
                                        />
                                    }
                                />
                            );
                        })
                    ) : (
                        <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay autos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AutosComponent;
