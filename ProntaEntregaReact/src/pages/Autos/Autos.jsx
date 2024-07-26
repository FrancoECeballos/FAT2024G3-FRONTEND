import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import fetchData from '../../functions/fetchData';

function AutosComponent() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [autos, setAutos] = useState([]);

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

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <h2>Lista de Autos</h2>
                <div className='auto-list'>
                    {Array.isArray(autos) && autos.length > 0 ? (
                        autos.map(auto => (
                            <GenericCard
                                key={auto.id_transporte}
                                titulo={`Marca: ${auto.marca} - Modelo: ${auto.modelo}`}
                                descrip1={`Patente: ${auto.patente}`}
                                descrip2={`Kilometraje: ${auto.kilometraje} km`}
                            />
                        ))
                    ) : (
                        <p>No hay autos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AutosComponent;
