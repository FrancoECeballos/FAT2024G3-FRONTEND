import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {InputGroup, Form, Button, Tabs, Tab} from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Products.scss';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';
import LittleCard from '../../../components/cards/little_card/LittleCard.jsx';
import GenericTable from '../../../components/tables/generic_table/GenericTable.jsx';

import addProd from '../../../assets/add_product.png';

import fetchData from '../../../functions/fetchData';
import Modal from '../../../components/modals/Modal.jsx';
import putData from '../../../functions/putData.jsx';
import postData from '../../../functions/postData.jsx';

function Products() {
    const navigate = useNavigate();
    const { stockId, categoriaID } = useParams();
    const token = Cookies.get('token');

    const cantidadRef = useRef(null);
    const cantidadUnidadesRef = useRef(null);
    const unidadMedidaRef = useRef(null);
    
    const [products, setProducts] = useState([]);

    const [selectedOperacion, setSelectedOperacion] = useState('sumar');

    const [currentObra, setCurrentObra] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(false);

    const [isPaquete, setIsPaquete] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState({});
    const [detalle, setDetalle] = useState([]);
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
        { type: 'cantidad', label: 'Cantidad' },
        { type: 'id_producto.id_unidadmedida.nombre', label: 'Unidad de Medida' },
    ];

    const detailFilters = [
        { type: 'cantidad', label: 'Cantidad' },
        { type: 'cantidadUnidades', label: 'Cantidad de Unidades' },
    ];

    const handleSearchChange = (value) => {
        setProductSearchQuery(value);
    };

    const newDetail = (product) => {
        setDetalle({ ...detalle, id_producto: product, id_stock: parseInt(stockId, 10) });
    };

    const resetDetail = () => {
        setDetalle({});
        setSelectedCardId({});
    };

    const newProduct = () => {
        if (selectedCardId != 'New') {
            const updatedDetalle = {
                ...detalle,
                id_producto: selectedCardId.id_producto,
                id_stock: parseInt(stockId, 10),
                cantidadUnidades: detalle.cantidadUnidades !== undefined ? detalle.cantidadUnidades : 1
            };
            setDetalle(updatedDetalle);

            if (!updatedDetalle.id_unidadmedida) {
                alert('Por favor seleccione una unidad de medida');
                return;
            } else if (!updatedDetalle.cantidad || updatedDetalle.cantidad <= 0) {
                alert('Por favor ingrese una cantidad válida');
                return;
            } else if (updatedDetalle.cantidadUnidades !== undefined && updatedDetalle.cantidadUnidades < 0) {
                alert('Por favor ingrese una cantidad de unidades válida');
                return;
            } else {
                postData(`detallestockproducto/`, updatedDetalle, token).then((result) => {
                    resetDetail();
                });
            }
        } else if (selectedCardId == 'New') {
            setShowNewProductModal(true);
        }
    };

    const handleSave = () => {
        if (!detalle.id_unidadmedida) {
            alert('Por favor seleccione una unidad de medida');
            return;
        } else if (!detalle.cantidad || detalle.cantidad <= 0) {
            alert('Por favor ingrese una cantidad válida');
            return;
        } else if (detalle.cantidadUnidades !== undefined && detalle.cantidadUnidades < 0) {
            alert('Por favor ingrese una cantidad de unidades válida');
            return;
        } else {
            if (selectedOperacion === 'sumar') {
                postData(`AddDetallestockproducto/`, detalle, token).then((result) => {
                    resetDetail();
                    window.location.reload();
                });
            } else if (selectedOperacion === 'restar') {
                postData(`SubtractDetallestockproducto/`, detalle, token).then((result) => {
                    resetDetail();
                    window.location.reload();
                });
            }
        }
    };

    const fetchSelectedObject = async (event) => {
        if (event.target.name === 'id_unidadmedida') {
            setIsPaquete(unidadMedida.find(item => item.id === parseInt(event.target.value, 10)).paquete)
            if (!unidadMedida.find(item => item.id === parseInt(event.target.value, 10)).paquete) {
                setDetalle({ ...detalle, cantidadUnidades: 1 });
            }
        }

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
                <Modal
                    openButtonText="Open Modal :D"
                    openButtonWidth="200px"
                    title="Crear un nuevo Producto"
                    content={<div>
                        <Form.Control name="nombre" type="text" placeholder="Nombre" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                        <Form.Control name="descripcion" type="text" placeholder="Descripción" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                    </div>}
                    saveButtonText={selectedCardId === 'New' ? 'Crear' : 'Agregar'}
                    showModal={showNewProductModal}
                    showButton={false}
                />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                    <Modal buttonStyle={{marginTop: '10rem'}} openButtonText='¿No encuentra el producto? Añadalo' openButtonWidth='20' title='Añadir Producto' saveButtonText={selectedCardId !== 'New' ? 'Agregar' : 'Crear'} handleSave={newProduct} handleCloseModal={resetDetail} content={
                        <div>
                            <h2 className='centered'> Elija el Producto </h2>
                            <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <GenericTable headers={["nombre", "descripcion"]} data={products} showCreateNew={true} createNewFunction={() => setSelectedCardId(selectedCardId === 'New' ? {} : 'New')}></GenericTable>
                            </div>
                            {selectedCardId && selectedCardId !== 'New' && Object.keys(selectedCardId).length > 0 && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
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
                                    <Form.Select name="id_unidadmedida" ref={unidadMedidaRef} onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                        <option autoFocus hidden>Seleccionar...</option>
                                        {unidadMedida
                                            .filter((item) => item.descripcion.includes(selectedCardId.id_unidadmedida.nombre))
                                            .map((item) => (
                                                <option key={item.id} value={item.id}>{item.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </>
                            )}
                            {selectedCardId && selectedCardId == 'New' && Object.keys(selectedCardId).length > 0 && (
                                <p style={{marginTop: '1rem'}}>Para crear un nuevo producto, seleccióne el botón <strong>Crear</strong> y lo enviará a la inferfaz de creación.</p>
                            )}
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
                                <Modal openButtonText="Modificar Stock" openButtonWidth='10' handleShowModal={() => newDetail(product.id_producto)} handleCloseModal={() => resetDetail()} title="Modificar Stock" saveButtonText="Guardar" handleSave={() => handleSave(product.id_detallestockproducto)}
                                    content={
                                        <div>
                                            <h2 className='centered'> Producto: {product.nombre} </h2>
                                            <InputGroup className="mb-2">
                                                <Form.Control name="cantidad" type="number" placeholder='Ingrese cuanto quiere restar/sumar' ref={cantidadRef} onChange={fetchSelectedObject} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}/>
                                            </InputGroup>
                                            <InputGroup className="mb-2">
                                                <Button className={`unified-input unified-input-left ${selectedOperacion === 'sumar' ? 'selected' : ''}`} style={{ borderBlockColor: '#3E4692;', marginTop: '1rem', flex: 1 }} tabIndex="0" onClick={() => setSelectedOperacion('sumar')}> Añadir </Button>
                                                <Button className={`unified-input unified-input-right ${selectedOperacion === 'restar' ? 'selected' : ''}`} style={{ borderBlockColor: '#3E4692;', marginTop: '1rem', flex: 1 }} tabIndex="0" onClick={() => setSelectedOperacion('restar')}> Quitar </Button>
                                            </InputGroup>
                                        </div>
                                    } />
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
