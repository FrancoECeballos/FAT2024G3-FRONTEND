import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../functions/fetchData';

function UserListing (){
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const token = Cookies.get('token');
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`).then((result) => {
            setAdminUser(result);
        });
        fetchData('/user')
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener los usuarios', error);
            });
    }, [token, navigate]);

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
                <SendButton onClick={() => navigate('/perfil/micuenta')} text="Mi cuenta" wide='25'/>
                </div>
                <SearchBar />
                {Array.isArray(users) && users.map(user => ( adminUser && adminUser.email !== user.email && (
                    <GenericCard 
                        key={user.id}
                        titulo={`${user.nombre} ${user.apellido}`}
                        descrip1={user.email}
                        descrip2={user.dni}
                        children = {<SendButton onClick={() => navigate('/perfil/micuenta/', {state: {user_email: `${user.email}`}})} text = 'Editar' backcolor = '#3E4692' letercolor='white'></SendButton>}
                    />
                )))}
            </div>
        </div>
    );
}

export default UserListing;