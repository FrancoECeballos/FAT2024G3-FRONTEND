import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {InputGroup, Form} from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Products.scss';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';

import fetchData from '../../../functions/fetchData';
import Modal from '../../../components/modals/Modal.jsx';
import putData from '../../../functions/putData.jsx';

function Products() {
    const navigate = useNavigate();
    const { casaId, categoriaID } = useParams();
    const token = Cookies.get('token');
    
    const [products, setProducts] = useState([]);
    const [unidadMedida, setUnidadMedida] = useState([]);
    const [isPaquete, setIsPaquete] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`casa/${casaId}/categoria/${categoriaID}/`, token).then((result) => {
            setProducts(result);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });

        fetchData(`unidad_medida/`, token).then((result) => {
            setUnidadMedida(result);
        })

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

    const handleSave  = async(id) => {
        await putData(`CambiarDetalleStock/${id}/`, 
        {},
        token).then(window.location.reload())
    };

    const fetchSelectedObject = async (event) => {
        setIsPaquete(unidadMedida.find(item => item.id === parseInt(event.target.value, 10)).paquete);
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
                        descrip2={`Cantidad: ${product.cantidad} ${product.id_unidadmedida.nombre}`}
                        children={
                            <Modal openButtonText="Modificar Stock" title="Modificar Stock" saveButtonText="Guardar" handleSave={handleSave}
                            content={
                                <div>
                                    <h2 className='centered'> Producto: {product.id_producto.nombre} </h2>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Form.Label style={{ marginLeft: '1rem' }}>Cantidad</Form.Label>
                                        {isPaquete && (
                                            <Form.Label style={{ marginRight: '1rem' }}>Cantidad/Paquetes</Form.Label>
                                        )}
                                    </div>
                                    <InputGroup className="mb-2">
                                        <Form.Control name="cantidad" type="number" 
                                            style={!isPaquete ? { borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' } : null}
                                            className={isPaquete ? "unified-input-left" : null} defaultValue={product.cantidad}/>
                                        {isPaquete && (
                                            <Form.Control name="cantidadUnidades" type="number" className="unified-input-right" defaultValue={product.cantidadUnidades}/>
                                        )}
                                    </InputGroup>
                                    <Form.Select name="unidadMedida" type="text" onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} defaultValue={product.id_unidadmedida.id_unidadmedida}>
                                        {unidadMedida.map((item) => (
                                            <option key={item.id} value={item.id}>{item.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                            }/>
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;
