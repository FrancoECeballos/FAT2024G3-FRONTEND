import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../../functions/fetchData';

function Categories (){

    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [categories, setCategories] = useState();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`categorias-productos/${location.state.id_casa}/`).then((result) => {
            setCategories(result)
        });
    }, [token, navigate]); 


    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar />
                {Array.isArray(categories) && categories.map((category => (
                    <GenericCard 
                        key={category.id_categoria}
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

export default Categories;