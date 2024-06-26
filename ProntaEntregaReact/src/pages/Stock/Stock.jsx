import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import './Stock.scss';

import fetchData from '../../functions/fetchData';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [houses, setHouses] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [orderCriteria, setOrderCriteria] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`/userToken/${token}`, token).then((result) => {
            console.log("User Token Result:", result);
            setIsAdmin(result.is_superuser);
            const email = result.email;

            if (result.is_superuser) {
                fetchData('/casa/', token).then((result) => {
                    console.log("Houses for Admin:", result);
                    setHouses(result);
                }).catch(error => {
                    console.error('Error fetching houses for admin', error);
                });
            } else {
                fetchData(`/user/casasEmail/${email}/`, token).then((result) => {
                    console.log("House for User:", result);
                    setHouses(result); // Asegúrate de que `result` es un array
                }).catch(error => {
                    console.error('Error fetching house for user', error);
                });
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [token, navigate]);

    useEffect(() => {
        if (orderCriteria) {
            const sortedHouses = [...houses].sort((a, b) => {
                if (orderCriteria === 'nombre') {
                    return a.nombre.localeCompare(b.nombre);
                } else if (orderCriteria === 'usuarios_registrados') {
                    return b.usuarios_registrados - a.usuarios_registrados;
                }
                return 0;
            });
            setHouses(sortedHouses);
        }
    }, [orderCriteria, houses]);

    const filters = [
        { type: 'nombre', label: 'Nombre Alfabético' },
        { type: 'usuarios_registrados', label: 'Usuarios Registrados' },
    ];

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar filters={filters} onOrderChange={setOrderCriteria} />
                {Array.isArray(houses) && houses.length > 0 ? (
                    houses.map(house => (
                        <GenericCard 
                            key={house.id_casa}
                            titulo={house.nombre}
                            descrip1={house.usuarios_registrados}
                            descrip2={`${house.id_direccion.localidad}, ${house.id_direccion.calle}, ${house.id_direccion.numero}`}
                            children={<SendButton onClick={() => navigate(`/casa/${house.id_casa}/categoria/1/`, { state: { id_casa: `${house.id_casa}` } })} text='Ver Stock' backcolor='#3E4692' letercolor='white' />}
                        />
                    ))
                ) : (
                    <p>No hay casas disponibles.</p>
                )}
            </div>
        </div>
    );
}

export default Stock;
