import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {InputGroup, Form, Button, Tabs, Tab} from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Products.scss';
import { Icon } from '@iconify/react';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';

import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';
import Modal from '../../../components/modals/Modal.jsx';
import GenericAlert from '../../../components/alerts/generic_alert/GenericAlert.jsx';
import AutoCompleteSelect from '../../../components/buttons/selectable_button/auto_complete_select.jsx';

function Products() {
    const navigate = useNavigate();
    const { stockId, categoriaID } = useParams();
    const token = Cookies.get('token');

    const cantidadRef = useRef(null);
    
    const [products, setProducts] = useState([]);
    const [excludedProducts, setExcludedProducts] = useState([]);

    const [selectedOperacion, setSelectedOperacion] = useState('sumar');

    const [currentObra, setCurrentObra] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(false);

    const [selectedCardId, setSelectedCardId] = useState(null);
    const [detalle, setDetalle] = useState([]);

    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showNewProductModal, setShowNewProductModal] = useState(false);

    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`GetProductoByStock/${stockId}/${categoriaID}/`, token).then((result) => {
            setProducts(result);
            const productsID = result.map(product => product.id_producto);
            postData(`GetProductosPorCategoriaExcluidos/${categoriaID}/`, { excluded_ids: productsID }, token).then((result) => {
                const transformedResult = result.map(product => ({
                    key: product.id_producto,
                    label: product.nombre
                }));
                setExcludedProducts(transformedResult);
            });
        });

        fetchData(`/stock/${stockId}`, token).then((result) => {
            setCurrentObra(result[0].id_obra.nombre);
        });

        fetchData(`/categoria/${categoriaID}`, token).then((result) => {
            setCurrentCategory(result[0].nombre);
        });

    }, [token, navigate, stockId, categoriaID]);

    const filteredProducts = products.filter(product => {
        return (
            product.nombre?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            product.descripcion?.toLowerCase().includes(productSearchQuery.toLowerCase())
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
        { type: 'total', label: 'Cantidad' },
        { type: 'product.unidadmedida', label: 'Unidad de Medida' },
    ];

    const handleSearchChange = (value) => {
        setProductSearchQuery(value);
    };

    const resetDetail = () => {
        setDetalle({});
        setSelectedCardId({});
    };

    const handleSave = async (cantidad, total, producto) => {
        try {
            const user = await fetchData(`userToken/${token}`, token);
    
            if (!cantidad || cantidad <= 0 || isNaN(cantidad) || cantidad > Number.MAX_SAFE_FLOAT) {
                setAlertMessage('Por favor ingrese una cantidad válida');
                setShowAlert(true);
                return false; 
            }
            if (selectedOperacion === 'restar' && cantidad > total) {
                setAlertMessage('No puede restar más de lo que hay en stock');
                setShowAlert(true);
                return false; 
            }
            const updatedDetalle = {
                ...detalle,
                ...(producto && { id_producto: producto }),
                id_usuario: user.id_usuario,
                cantidad: cantidad,
            };
            if (selectedOperacion === 'sumar' || producto) {
                await postData(`AddDetallestockproducto/`, updatedDetalle, token);
                window.location.reload();
                return true; 
            } else if (selectedOperacion === 'restar') {
                await postData(`SubtractDetallestockproducto/`, updatedDetalle, token);
                window.location.reload();
                return true; 
            }
        } catch (error) {
            console.error('Error fetching user or posting data:', error);
            setAlertMessage('Ocurrió un error. Por favor, inténtelo de nuevo.');
            setShowAlert(true);
            return false;
        }
    };

    const setSelectedNewProduct = (product) => {
        setSelectedCardId(product);
    };

    const fetchSelectedObject = async (event) => {
        const { name, value } = event.target;
        setDetalle((prevData) => {
            const updatedData = { ...prevData, [name]: parseInt(value, 10) };
            return updatedData;
        });
    };

    const handleSelect = (k) => {
        if (k === 'Todos') {
            fetchProducts('Todos');
        } else {
            fetchProducts((Number(k)), false);
        }
    };

    return (
        <div>
            <FullNavbar selectedPage='Stock'/>
            <div className='margen-arriba'>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8%' }}>
                    <h4 style={{ color: 'grey', cursor: 'pointer' }} onClick={() => navigate('/stock')} onMouseEnter={(e) => e.target.style.color = 'blue'} onMouseLeave={(e) => e.target.style.color = 'grey'}>Stock</h4>
                    <h4 style={{ color: 'grey', marginLeft: '0.5rem' }}> // <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/obra/${stockId}/categoria`, { state: { id_stock: `${stockId}` } })} onMouseEnter={(e) => e.target.style.color = 'blue'} onMouseLeave={(e) => e.target.style.color = 'grey'}>{currentObra}</span></h4>
                    <h4 style={{ color: 'grey', marginLeft: '0.5rem' }}> // {currentCategory}</h4>
                </div>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                    <Tabs
                        onSelect={handleSelect}>
                        <Tab
                            style={{backgroundColor:'transparent'}}
                            key='Todos'
                            eventKey='Todos'
                            title='Todos'
                            onSelect={() => setSelectedCategoriaProducto('Todos')}
                        />
                    </Tabs>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                    <Modal buttonStyle={{marginTop: '10rem'}} openButtonText='¿No encuentra el producto? Añadalo' openButtonWidth='20' title='Añadir Producto' saveButtonText={selectedCardId !== 'New' ? 'Agregar' : 'Crear'} handleShowModal={() => setDetalle({id_stock: parseInt(stockId, 10)})}
                    handleSave={() => {
                        if (cantidadRef.current) {
                            handleSave(parseFloat(cantidadRef.current.value), products.total, selectedCardId);
                        } else { setAlertMessage('Por favor seleccione un producto'); setShowAlert(true);}
                    }} handleCloseModal={() => {setShowAlert(false); resetDetail();}} content={
                        <div>
                            <GenericAlert ptamaño="0.9" title="Error" description={alertMessage} type="danger" show={showAlert} setShow={setShowAlert}></GenericAlert>
                            <h2 className='centered'> Elija el Producto </h2>
                            <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <AutoCompleteSelect lists={excludedProducts} selectedKey={selectedCardId} onClick={setSelectedNewProduct} onInputChange={() => { setSelectedCardId(); cantidadRef.current = 0; }} addNewButton={true} />
                            </div>
                            {selectedCardId && selectedCardId !== 'New' && selectedCardId !== -1 &&
                                <InputGroup className="mb-2">
                                    <Form.Control name="cantidad" type="number" placeholder='Ingrese cuanto quiere ingresar como cantidad inicial' ref={cantidadRef} onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                                </InputGroup>
                            }
                            {selectedCardId && selectedCardId === 'New' && selectedCardId !== -1 &&
                                <InputGroup className="mb-2">
                                    <Form.Label style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}/>Precione el boton 'Crear' para añadir un nuevo producto<Form.Label/>
                                </InputGroup>
                            }
                        </div>
                    }></Modal>
                </div>
                {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? sortedProducts.map(product => {
                    return (
                        <GenericCard
                            foto={product.imagen}
                            key={product.id_producto}
                            titulo={product.nombre}
                            descrip1={product.descripcion}
                            descrip2={`Cantidad: ${product.total} ${product.unidadmedida}`}
                            children={
                                <div style={{ position: 'relative' }}>
                                    <Icon 
                                        icon="line-md:alert-circle-twotone" 
                                        className="hoverable-icon"
                                        style={{
                                            width: "2rem", 
                                            height: "2rem", 
                                            position: "absolute", 
                                            top: "0.5rem", 
                                            right: "0.5rem", 
                                            color: "#858585",
                                            transition: "transform 0.3s"
                                        }} 
                                        onClick={() => navigate(`/obra/${stockId}/categoria/${categoriaID}/producto/${product.id_producto}`, { state: { id_stock : stockId, id_categoria: categoriaID } })}
                                    />
                                    <Modal openButtonText="Modificar Stock" openButtonWidth='10' handleShowModal={() => setDetalle({id_producto: product.id_producto, id_stock: parseInt(stockId, 10) })} handleCloseModal={() => setShowAlert(false)} title="Modificar Stock" saveButtonText="Guardar" handleSave={() => handleSave(parseFloat(cantidadRef.current.value), product.total)}
                                        content={
                                            <div>
                                                <GenericAlert ptamaño="0.9" title="Error" description={alertMessage} type="danger" show={showAlert} setShow={setShowAlert}></GenericAlert>
                                                <h2 className='centered'> Producto: {product.nombre} </h2>
                                                <Form.Label style={{ marginLeft: '1rem' }}>Cantidad Actual: {product.total} {product.unidadmedida}</Form.Label>
                                                <InputGroup className="mb-2">
                                                    <Form.Control name="cantidad" type="number" placeholder='Ingrese cuanto quiere restar/sumar' ref={cantidadRef} onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <Button className={`unified-input unified-input-left ${selectedOperacion === 'sumar' ? 'selected' : ''}`} style={{ borderBlockColor: '#3E4692', marginTop: '1rem', flex: 1 }} tabIndex="0" onClick={() => setSelectedOperacion('sumar')}> Añadir </Button>
                                                    <Button className={`unified-input unified-input-right ${selectedOperacion === 'restar' ? 'selected' : ''}`} style={{ borderBlockColor: '#3E4692', marginTop: '1rem', flex: 1 }} tabIndex="0" onClick={() => setSelectedOperacion('restar')}> Quitar </Button>
                                                </InputGroup>
                                            </div>
                                        } 
                                    />
                                </div>
                            }
                        />
                    );
                }) : (
                    <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay Productos disponibles.</p>
                )}
            </div>
        </div>
    );
}

export default Products;
