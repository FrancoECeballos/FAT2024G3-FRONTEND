import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {InputGroup, Form} from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Products.scss';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import AcordeonCard from '../../../components/cards/acordeon_card/AcordeonCard.jsx';
import LittleCard from '../../../components/cards/little_card/LittleCard.jsx';

import fetchData from '../../../functions/fetchData';
import Modal from '../../../components/modals/Modal.jsx';
import putData from '../../../functions/putData.jsx';

function Products() {
    const navigate = useNavigate();
    const { stockId, categoriaID } = useParams();
    const token = Cookies.get('token');

    const cantidadRef = useRef(null);
    const cantidadUnidadesRef = useRef(null);
    const unidadMedidaRef = useRef(null);
    
    const [products, setProducts] = useState([]);
    const [combinedProducts, setCombinedProducts] = useState([]);
    const [unidadMedida, setUnidadMedida] = useState([]);
    const [isPaquete, setIsPaquete] = useState(true);
    const [detalle, setDetalle] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        const fetchProducts = async () => {
            try {
                const productsData = await fetchData(`casa/${stockId}/categoria/${categoriaID}/`, token);
                const allProductsData = await fetchData(`productos/`, token);
    
                const combinedProducts = allProductsData.map(product => {
                    const detalles = productsData.filter(item => item.id_producto.id_producto === product.id_producto);
                    return {
                        ...product,
                        ...(detalles.length > 0 && { id_detalle: detalles })
                    };
                }).filter(product => product.id_detalle);
    
                setProducts(productsData);
                setCombinedProducts(combinedProducts);
                console.log('Combined Products:', combinedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData(`unidad_medida/`, token).then((result) => {
            setUnidadMedida(result);
        });
    
        fetchProducts();
    }, [token, navigate, stockId, categoriaID]);

    const filteredProducts = combinedProducts.filter(product => {
        return (
            product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const newDetail = (product) => {
        setDetalle({ ...detalle, id_producto: product, id_stock: parseInt(stockId, 10) });
    };

    const resetDetail = () => {
        setDetalle({});
    };

    const handleSave = (id) => {
        if (!detalle.id_unidadMedida) {
            alert('Por favor seleccione una unidad de medida');
            return;
        } else if (!detalle.cantidad || detalle.cantidad <= 0) {
            alert('Por favor ingrese una cantidad válida');
            return;
        } else if (detalle.cantidadUnidades !== undefined && detalle.cantidadUnidades < 0) {
            alert('Por favor ingrese una cantidad de unidades válida');
            return;
        } else if (combinedProducts.id_producto(id).id_detalle.some(detail => detail.id_unidadMedida === detalle.id_unidadMedida)) {
            putData(`editar_unidad_medida/${id}/`, detalle, token).then((result) => {
                console.log('Detail Updated:', result);
                resetDetail();
            });
        } else {
            postData(`crear_unidad_medida/`, detalle, token).then((result) => {
                console.log('Detail Created:', result);
                resetDetail();
            });
        }
    };

    const fetchSelectedObject = async (event) => {
        if (event.target.name === 'id_unidadMedida') {
            setIsPaquete(unidadMedida.find(item => item.id === parseInt(event.target.value, 10)).paquete);
        }

        const { name, value } = event.target;
        setDetalle((prevData) => {
            const updatedData = { ...prevData, [name]: parseInt(value, 10) };
            console.log(updatedData);
            return updatedData;
        });
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                {Array.isArray(sortedProducts) && sortedProducts.map(product => {
                    const totalMultiplicacion = product.id_detalle ? product.id_detalle.reduce((sum, detail) => sum + detail.multiplicacion, 0) : 0;
                    return (
                        <AcordeonCard
                            key={product.id_producto}
                            titulo={product.nombre}
                            acordeonTitle={`Ver almacén de: ${product.nombre}`}
                            descrip1={product.descripcion}
                            descrip2={`Total: ${totalMultiplicacion} ${product.id_unidadmedida.identificador}`}
                            children={
                                <Modal openButtonText="Modificar Stock" handleShowModal={() => newDetail(product.id_producto)} handleCloseModal={() => resetDetail()} title="Modificar Stock" saveButtonText="Guardar" handleSave={() => handleSave(product.id_detallestockproducto)}
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
                                                <Form.Control name="cantidad" type="number" ref={cantidadRef} onChange={fetchSelectedObject}
                                                    style={!isPaquete ? { borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' } : null}
                                                    className={isPaquete ? "unified-input-left" : null} />
                                                {isPaquete && (
                                                    <Form.Control name="cantidadUnidades" type="number" ref={cantidadUnidadesRef} className="unified-input-right" onChange={fetchSelectedObject} />
                                                )}
                                            </InputGroup>
                                            <Form.Select name="id_unidadMedida" ref={unidadMedidaRef} onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                <option autoFocus hidden>Seleccionar...</option>
                                                {unidadMedida.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    } />
                            }
                            accordionChildren={
                                <div className="little-cards-container">
                                    {Array.isArray(product.id_detalle) && product.id_detalle.map(detail => {
                                        return (
                                            <LittleCard
                                                key={detail.id_detallestockproducto}
                                                foto={detail.id_producto.foto}
                                                titulo={detail.id_unidadmedida.nombre}
                                                descrip1={
                                                    detail.id_unidadmedida.paquete
                                                        ? `Cantidad: ${detail.cantidad} ${detail.id_unidadmedida.identificador} ${detail.cantidadUnidades}`
                                                        : `Cantidad: ${detail.cantidad} ${detail.id_unidadmedida.identificador}`
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Products;
