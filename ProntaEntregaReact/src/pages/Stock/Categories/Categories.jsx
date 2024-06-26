import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../../functions/fetchData';

function Categories() {
    const navigate = useNavigate();
    const { casaId, categoriaId } = useParams(); // Obtener parámetros de la URL
    const token = Cookies.get('token');
    const [categories, setCategories] = useState([]);
    const [orderCriteria, setOrderCriteria] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`categorias-productos/${casaId}/`, token).then((result) => {
            setCategories(result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, [token, navigate, casaId]); // Agregar casaId como dependencia

    useEffect(() => {
        if (orderCriteria) {
            const sortedCategories = [...categories].sort((a, b) => {
                if (orderCriteria === 'nombre') {
                    return a.nombre.localeCompare(b.nombre);
                }
                return 0;
            });
            setCategories(sortedCategories);
        }
    }, [orderCriteria, categories]);

    const filters = [
        { type: 'nombre', label: 'Nombre Alfabético' },
    ];

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar filters={filters} onOrderChange={setOrderCriteria} />
                {Array.isArray(categories) && categories.map(category => (
                    <GenericCard 
                        key={category.id_categoria}
                        titulo={category.nombre} // Cambiar 'house' por 'category'
                        descrip1={category.descripcion} // Ajusta esto según tus datos
                        descrip2={`ID: ${category.id_categoria}`} // Ajusta esto según tus datos
                        children={
                            <SendButton
                                onClick={() => navigate(`/casa/${casaId}/categoria/${category.id_categoria}/`, { state: { id_casa: casaId } })}
                                text='Ver Stock'
                                backcolor='#3E4692'
                                letercolor='white'
                            />
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default Categories;
