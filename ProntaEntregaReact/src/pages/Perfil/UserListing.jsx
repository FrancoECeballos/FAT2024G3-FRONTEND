import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../functions/fetchData';

function UserListing() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const { obraId } = useParams();
    const [currentObra, setCurrentObra] = useState('');

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
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8%' }}>
                    <h4 style={{ color: 'grey', cursor: 'pointer' }} onClick={() => navigate('/selectuser')} onMouseEnter={(e) => e.target.style.color = 'blue'} onMouseLeave={(e) => e.target.style.color = 'grey'}>Usuarios</h4>
                    <h4 style={{ color: 'grey', marginLeft: '0.5rem' }}> // {currentObra}</h4>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
                    <SendButton onClick={() => navigate('/perfil/micuenta')} text="Mi cuenta" wide='25' />
                </div>
                <SearchBar 
                    onSearchChange={handleSearchChange} 
                    onOrderChange={setOrderCriteria} 
                    filters={filters} // Asegurarse de que filters se pase como un array
                />
                {Array.isArray(users) && sortedUsers.map(user => (
                    adminUser && (
                        adminUser.email !== user.email ? (
                            <GenericCard 
                                onClick={() => navigate('/perfil/micuenta/', {state: {user_email: `${user.email}`}})}
                                key={user.id}
                                titulo={`${user.nombre} ${user.apellido}`}
                                foto={user.imagen}
                                descrip1={user.email}
                                descrip2={user.documento}
                            />
                        ) : (
                            <GenericCard cardStyle={{backgroundColor: 'lightgrey', border: '1px solid #3E4692'}}
                                onClick={() => navigate('/perfil/micuenta')}
                                key={user.id}
                                titulo={`Admin: ${user.nombre} ${user.apellido}`}
                                foto={user.imagen}
                                descrip1={user.email}
                                descrip2={user.documento}
                                descrip3={<strong>Este es su propio usuario</strong>}
                            />
                        )
                    )
                ))}
            </div>
        </div>
    );
}

export default UserListing;
