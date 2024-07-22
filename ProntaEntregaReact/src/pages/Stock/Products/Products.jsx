import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../../functions/fetchData';

function Products() {
    const navigate = useNavigate();
    const { casaId, categoriaID } = useParams();
    const token = Cookies.get('token');
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`casa/${casaId}/categoria/${categoriaID}/`, token).then((result) => {
            setProducts(result);
            console.log('Products fetched:', result);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    }, [token, navigate, casaId]);

    const filteredProducts = products.filter(product => {
        return (
            product.id_producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id_producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id_producto.id_unidadmedida.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
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
        { type: 'cantidad', label: 'Cantidad' },
        { type: 'id_producto.id_unidadmedida.nombre', label: 'Unidad de Medida' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                {Array.isArray(sortedProducts) && sortedProducts.map(product => (
                    <GenericCard 
                        key={product.id_producto.id_producto}
                        titulo={product.id_producto.nombre}
                        descrip1={product.id_producto.descripcion}
                        descrip2={`Cantidad: ${product.cantidad} ${product.id_producto.id_unidadmedida.nombre}`}
                        children={
                            <SendButton
                                onClick={() => navigate(`/casa/${casaId}/categoria/${product.id_categoria}/`, { state: { id_casa: casaId } })}
                                text='Editar Cantidad'
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

export default Products;
