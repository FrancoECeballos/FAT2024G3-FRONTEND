import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/GenericCard.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import './Stock.scss';

import fetchData from '../../functions/fetchData';

function Stock (){

    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [houses, setHouses] = useState({
        id_casa: '',
        nombre: '',
        descripcion: '',
        count_users: '',
        id_direccion: {
            localidad: '',
            calle: '',
            numero: ''
        },
        id_organizacion: ''

    });

    const [isAdmin, setIsAdmin] = useState(); 

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`/userToken/${token}`).then((result) => {
            setIsAdmin(result.is_superuser);
            if (result.is_superuser) {
                fetchData('/casa/', token).then((result) => {
                    setHouses(result);
                });
            } else {
                fetchData(`/casaToken/${token}`).then((result) => {
                    setHouses(result);
                });
            }
        });
    }, [token, navigate]); 


    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar />
                {Array.isArray(houses) && houses.map((house => (
                    <GenericCard 
                        key={house.id_casa}
                        titulo={house.nombre}
                        descrip1={house.count_users}
                        descrip2={`${house.id_direccion.localidad}, ${house.id_direccion.calle}, ${house.id_direccion.numero}`}
                        children = {<SendButton onClick={() => navigate('/stock/categories', {state: {id_casa: `${house.id_casa}`}})} text = 'Ver Stock' backcolor = '#3E4692' letercolor='white'></SendButton>}
                    />
                )))}
            </div>
        </div>
    );
}

export default Stock;