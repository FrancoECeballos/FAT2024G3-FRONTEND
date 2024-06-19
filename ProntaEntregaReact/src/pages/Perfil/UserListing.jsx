import React, { useState, useEffect } from 'react';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx';
import fetchData from '../../functions/fetchData';

function UserListing (){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchData('/user')
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los usuarios', error);
            });
    }, []);

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar />
                {Array.isArray(users) && users.map(user => (
                    <GenericCard 
                        key={user.id}
                        titulo={`${user.nombre_usuario} ${user.apellido}`}
                        descrip1={user.email}
                        descrip2={user.dni}
                    />
                ))}
            </div>
        </div>
    );
}

export default UserListing;