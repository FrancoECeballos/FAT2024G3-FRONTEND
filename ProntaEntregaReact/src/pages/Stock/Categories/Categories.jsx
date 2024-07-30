import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';

import fetchData from '../../../functions/fetchData';

import Modal from '../../../components/modals/Modal.jsx';
import {InputGroup, Form, Button} from 'react-bootstrap';
import postData from '../../../functions/postData.jsx';

function Categories() {
    const navigate = useNavigate();
    const { stockId, categoriaId } = useParams();
    const token = Cookies.get('token');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    const [formCategoryData, setFormCategoryData] = useState({
        "nombre": "",
      });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`categorias-productos/${stockId}/`, token).then((result) => {
            setCategories(result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, [token, navigate, stockId]);

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

    const newcategory = () => {
        postData('newcategory/', formCategoryData, token);
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                {Array.isArray(sortedCategories) && sortedCategories.length > 0 ? sortedCategories.map(category => (  
                    <GenericCard 
                        onClick={() => navigate(`/casa/${stockId}/categoria/${category.id_categoriaproducto}/`, { state: { id_stock: stockId } })}
                        key={category.id_categoria}
                        titulo={category.nombre}
                        descrip1={category.descripcion}
                        descrip2={`Cantidad de Productos: ${category.cantidad_productos}`}
                    />
                )) : (
                    <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay categorías disponibles.</p>
                )}
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
                    <Modal openButtonText='¿No encuentra la categoria? Añadala' openButtonWidth='20' title='Nueva Categoria' saveButtonText='Crear' handleSave={newcategory} handleShowModal content={
                        <div>
                            <h2 className='centered'> Nueva Categoria </h2>
                            <Form.Control name="nombre" type="text" placeholder="Nombre" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                            <Form.Control name="descripcion" type="text" placeholder="Descripción" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                        </div>
                    }></Modal>
                </div>
            </div>
        </div>
    );
}

export default Categories;
