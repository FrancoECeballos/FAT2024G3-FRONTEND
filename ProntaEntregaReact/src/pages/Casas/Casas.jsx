import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../functions/fetchData';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [houses, setHouses] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

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
                    const houseIds = result.map(house => house.id_casa);
                    const housePromises = houseIds.map(id => fetchData(`/casa/${id}`, token));
                    Promise.all(housePromises).then(houses => {
                        console.log("Fetched Houses:", houses);
                        setHouses(houses.flat());
                    }).catch(error => {
                        console.error('Error fetching houses by ID', error);
                    });
                }).catch(error => {
                    console.error('Error fetching house for user', error);
                });
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [token, navigate]);

    const filteredHouses = houses.filter(house => {
        return (
            house.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.id_direccion.localidad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.id_direccion.calle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedHouses = [...filteredHouses].sort((a, b) => {
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
        { type: 'nombre', label: 'Nombre Alfabético' },
        { type: 'usuarios_registrados', label: 'Usuarios Registrados' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                {Array.isArray(sortedHouses) && sortedHouses.length > 0 ? (
                    sortedHouses.map(house => (
                        <GenericCard
                            key={house.id_casa}
                            foto={house.imagen}
                            titulo={house.nombre}
                            descrip1={`Usuarios Registrados: ${house.usuarios_registrados}`}
                            descrip2={`${house.id_direccion.localidad}, ${house.id_direccion.calle}, ${house.id_direccion.numero}`}
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
