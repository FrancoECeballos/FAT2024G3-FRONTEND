import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx'; // Importa tu componente genérico de tarjeta
import fetchData from '../../functions/fetchData';

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);

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

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <h2>Ofertas</h2>
                <div className='oferta-list'>
                    {Array.isArray(ofertas) && ofertas.length > 0 ? (
                        ofertas.map(oferta => (
                            <GenericCard
                                key={oferta.id_oferta}
                                titulo={`Ofertas ${oferta.id_oferta}`}
                                descrip1={`Fecha Inicio: ${oferta.fechainicio ? oferta.fechainicio.split('-').reverse().join('/') : ''} ${oferta.horainicio}`}
                                descrip2={`Fecha Vencimiento: ${oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''} ${oferta.horavencimiento}`}
                            />
                        ))
                    ) : (
                        <p>No hay ofertas disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ofertas;
