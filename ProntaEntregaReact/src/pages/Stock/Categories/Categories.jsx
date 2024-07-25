import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../../functions/fetchData';

function Categories() {
    const navigate = useNavigate();
    const { casaId, categoriaId } = useParams();
    const token = Cookies.get('token');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`categorias-productos/${casaId}/`, token).then((result) => {
            setCategories(result);
            console.log('Categories fetched:', result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, [token, navigate, casaId]);

    const filteredCategories = categories.filter(category => {
        return (
            category.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedCategories = [...filteredCategories].sort((a, b) => {
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
        { type: 'cantidad_productos', label: 'Cantidad de Productos' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };



    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                {Array.isArray(sortedCategories) && sortedCategories.map(category => (  
                    <GenericCard 
                        onClick={() => navigate(`/casa/${casaId}/categoria/${category.id_categoriaproducto}/`, { state: { id_casa: casaId } })}
                        key={category.id_categoria}
                        titulo={category.nombre}
                        descrip1={category.descripcion}
                        descrip2={`Cantidad de Productos: ${category.cantidad_productos}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Categories;
