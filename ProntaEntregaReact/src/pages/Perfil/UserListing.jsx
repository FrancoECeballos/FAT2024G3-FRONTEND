import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericAccordeon from '../../components/accordions/generic_accordion/GenericAccordion.jsx';

import fetchData from '../../functions/fetchData';

function UserListing() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const { obraId } = useParams();

    const [adminUser, setAdminUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`).then((result) => {
            setAdminUser(result);
        });
        fetchData(`/user/obra/${obraId}/`)
            .then(data => {
                console.log(data);
                setUsers(data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los usuarios', error);
        });

        fetchData(`/obra/${obraId}`, token).then((result) => {
            setCurrentObra(result[0].nombre);
        });
    }, [token, navigate]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const filters = [
        { type: 'nombre', label: 'Nombre Alfabético' },
        { type: 'apellido', label: 'Apellido Alfabético' },
        { type: 'email', label: 'Email Alfabético' },
        { type: 'id_tipousuario', label: 'Rango' },
        { type: 'documento', label: 'DNI' },
        { type: 'telefono', label: 'Teléfono' },
    ];

    const filteredUsers = users.filter(user => {
        return (
            user.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.documento?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!orderCriteria) return 0;
        if (a[orderCriteria]?.toLowerCase() < b[orderCriteria]?.toLowerCase()) return -1;
        if (a[orderCriteria]?.toLowerCase() > b[orderCriteria]?.toLowerCase()) return 1;
        return 0;
    });

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar 
                    onSearchChange={handleSearchChange} 
                    onOrderChange={setOrderCriteria} 
                    filters={filters}
                />
                <GenericAccordeon
                    wide={'80%'}
                    titulo="aaaaaaaaaa"
                    children={["bbbbbbbbbb", "cccccccccccc", "dddddddddddd"]}
                />
            </div>
        </div>
    );
}

export default UserListing;
