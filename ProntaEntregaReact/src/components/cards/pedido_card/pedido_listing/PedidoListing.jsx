import React, { useState, useEffect, useRef } from 'react';
import Loading from '../../../loading/loading.jsx';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import GenericCard from '../../../cards/generic_card/GenericCard.jsx';
import deleteData from '../../../../functions/deleteData.jsx';
import Modal from '../../../modals/Modal.jsx';
import GenericAccordion from '../../../accordions/generic_accordion/GenericAccordion.jsx';
import postData from '../../../../functions/postData.jsx';
import Semaforo from '../../../semaforo/Semaforo.jsx';
import fetchData from '../../../../functions/fetchData.jsx';
import crearNotificacion from '../../../../functions/createNofiticacion.jsx';
import AutoCompleteSelect from '../../../selects/auto_complete_select/auto_complete_select.jsx';

function PedidoListing({ sortedPedidos, obraSelected, obrasDisponibles, user, setShowPopup, setPopupMessage, setPopupTitle, reloadData }) {
    const token = Cookies.get('token');

    const [cantidad, setCantidad] = useState('');
    const [productos, setProductos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [error, setError] = useState('');
    const pedidoCardRef = useRef(null);

    const [selectedPedido, setSelectedPedido] = useState({});
    const [selectedObra, setSelectedObra] = useState(obraSelected);
    const [selectedProducto, setSelectedProducto] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pedidoCardRef.current) {
                setIsFormValid(pedidoCardRef.current.isFormValid);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [pedidoCardRef]);

    useEffect(() => {
        if (sortedPedidos !== undefined) {
            setIsLoading(false);
        }
    }, [sortedPedidos]);

    useEffect(() => {
        if (obrasDisponibles && obrasDisponibles.length === 1) {
            if (selectedPedido.id_obra && selectedPedido.id_obra.id_obra !== obrasDisponibles[0].id_obra) {
                setSelectedObra(obrasDisponibles[0]);
            }
        }
    }, [obrasDisponibles, selectedPedido]);

    const handleChange = (event) => {
        setCantidad(event.target.value);
        if (event.target.value === '') {
            setError('La cantidad no puede estar vacía');
        } else {
            setError('');
        }
    };

    const deletePedido = (stock, pedido) => {
        deleteData(`/delete_detalle_pedido/${stock}/${pedido}/`, token).then(() => {
            setPopupTitle('Pedido Eliminado');
            setPopupMessage('El pedido ha sido eliminado exitosamente.');
            setShowPopup(true);
            setSelectedPedido({});
            setCantidad('');
            reloadData();
        }).catch(error => {
            console.error('Error deleting pedido:', error);
            setPopupTitle('Error');
            setPopupMessage('Hubo un error al eliminar el pedido.');
            setShowPopup(true);
        });
    };
    
    const createAportePedido = async (pedidoId, usuarioId, cantidad, fechaAportado) => {
        const pedido = sortedPedidos.flatMap(obra => obra.pedidos).find(pedido => pedido.id_pedido === pedidoId);
        const cantidadRestante = pedido.cantidad - pedido.progreso;
        if (parseFloat(cantidad) > parseFloat(cantidadRestante)) {
            setError(`La cantidad ofrecida no puede exceder la cantidad restante de ${cantidadRestante} ${pedido.id_producto.unidadmedida}`);
            return false;
        } else if (parseFloat(cantidad) <= 0 || !cantidad) {
            setError('La cantidad ofrecida no puede ser menor o igual a 0');
            return false;
        } else if (!selectedProducto || selectedProducto == {}) {
            setError('El producto ingresado no es correcto');
            return false;
        }
    
        const data = {
            cantidad: parseInt(cantidad, 10),
            fechaAportado: fechaAportado,
            id_producto: selectedProducto,  
            id_pedido: pedidoId,
            id_usuario: usuarioId,
            id_obra: selectedObra.id_obra,
        };
    
        try {
            await postData('/crear_aporte_pedido/', data, token).then(async () => {
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const pedidoAportado = await fetchData(`/pedido/${pedidoId}/`, token);
    
                const dataNotificacion = {
                    titulo: 'Nuevo Aporte',
                    descripcion: `Aporte de ${data.cantidad} creado por ${user.nombre} ${user.apellido} a tu pedido de ${pedidoAportado[0].id_producto.nombre}.`,
                    id_obra: selectedPedido.id_obra.id_obra,
                    fecha_creacion: fechaCreacion
                };
                
                await crearNotificacion(dataNotificacion, token, 'User', selectedPedido.id_usuario.id_usuario);
                setPopupTitle('Aporte Creado');
                setPopupMessage('El aporte ha sido creado exitosamente.');
                setShowPopup(true);
                setSelectedPedido({});
                setCantidad('');
                reloadData();
                return true;
            });
        } catch (error) {
            console.error('Error creando el aporte del pedido:', error);
            setPopupTitle('Error');
            setPopupMessage('Hubo un error al crear el aporte.');
            setShowPopup(true);
            return false;
        }
    };

    const handlePedidoClick = async (pedido) => {
        setSelectedPedido(pedido);
        if (obrasDisponibles && obrasDisponibles.length > 1) {
            const filteredObras = obrasDisponibles.filter(obra => pedido.id_obra && pedido.id_obra.id_obra !== obra.id_obra);
            if (filteredObras.length > 0) {
                setSelectedObra(filteredObras[0]);
            }
        }
        await fetchData(`/producto/categoria/${pedido.id_producto.id_categoria.id_categoria}/`, token).then((result) => {
            const transformedResult = result.map(product => ({
                key: product.id_producto,
                label: `${product.nombre} - ${product.descripcion}`,
            }));
            setProductos(result);
            setFilteredProducts(transformedResult);
            setSelectedProducto(pedido.id_producto.id_producto);
        });
    };

    if (isLoading) {
        return <div><Loading /></div>;
    }

    const shouldShowButtons = !(obrasDisponibles && obrasDisponibles.length === 1 && selectedPedido.id_obra && selectedPedido.id_obra.id_obra === obrasDisponibles[0].id_obra);

    return (
        <div className='pedido-list'>
            <h1>Viendo {obraSelected ? `los pedidos hechos a la obra '${obraSelected.nombre}'` : 'todos los pedidos'}</h1>
            <div className='cardCategori'>
                {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                    sortedPedidos.map(obra => (
                        <GenericAccordion titulo={`Pedidos de '${obra.obra.nombre}'`} key={obra.obra.id_obra}
                            children={obra.pedidos.map(pedido => (
                                <div onClick={() => handlePedidoClick(pedido)}>
                                    <GenericCard hoverable={true}
                                        wide={'100%'}
                                        key={pedido.id_pedido} 
                                        foto={pedido.id_producto.imagen}
                                        titulo={pedido.id_producto.nombre}
                                        descrip1={<><strong>Cantidad:</strong> {pedido.progreso} / {pedido.cantidad} {pedido.id_producto.unidadmedida}</>}
                                        descrip2={<><strong>Urgencia:</strong> {pedido.urgente_label} <Semaforo urgencia={pedido.urgente}/></>}
                                        descrip3={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
                                        descrip4={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento}</>}
                                        children={
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip style={{ fontSize: '100%' }}>Tomar el pedido</Tooltip>}
                                            >
                                                <Icon className="hoverable-icon" style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1.1rem", right: "0.5rem", color: "#858585", transition: "transform 0.3s" }} icon="line-md:download-outline" />
                                            </OverlayTrigger>
                                        }
                                    />
                                </div>
                            ))}
                        />
                    ))
                ) : (
                    <p style={{ marginLeft: '7rem', marginTop: '1rem' }}> No hay pedidos disponibles.</p>
                )}
            </div>
            <Modal
                showButton={false}
                showDeleteButton={shouldShowButtons}
                saveButtonShown={shouldShowButtons}
                showModal={Object.keys(selectedPedido).length > 0}
                saveButtonText='Tomar'
                handleCloseModal={() => {setSelectedPedido({}); setProductos([]);}}
                handleShowModal={() => console.log(selectedPedido)}
                deleteFunction={() => deletePedido(selectedObra.id_obra, selectedPedido.id_pedido)}
                deleteButtonText='Rechazar'
                title='Tomar Pedido'
                handleSave={() => createAportePedido(selectedPedido.id_pedido, user.id_usuario, cantidad, new Date().toISOString().split('T')[0])}
                content={
                    <div>
                        {selectedPedido && selectedPedido.id_producto && (
                            <>
                                <GenericCard
                                    borde={'none'}
                                    shadow={'none'}
                                    hoverable={false}
                                    key={selectedPedido.id_pedido}
                                    foto={selectedPedido.id_producto.imagen}
                                    titulo={selectedPedido.id_producto.nombre}
                                    descrip1={<><strong>Cantidad:</strong> {selectedPedido.progreso} / {selectedPedido.cantidad} {selectedPedido.id_producto.unidadmedida}</>}
                                    descrip2={<><strong>Urgencia:</strong> {selectedPedido.urgente_label} <Semaforo urgencia={selectedPedido.urgente}/></>}
                                    descrip3={<><strong>Fecha Inicio:</strong> {selectedPedido.fechainicio}</>}
                                    descrip4={<><strong>Fecha Vencimiento:</strong> {selectedPedido.fechavencimiento}</>}
                                    descrip5={<><strong>Obra:</strong> {selectedPedido.id_obra.nombre}</>}
                                    descrip6={<><strong>Usuario:</strong> {selectedPedido.id_usuario.nombre} {selectedPedido.id_usuario.apellido}</>}
                                />
                            
                                {shouldShowButtons && (
                                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                                        {productos && productos.length !== 0 && (
                                            <div style={{ marginBottom: "1rem" }}>
                                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                                    Ingrese el producto que quiere aportar (*)
                                                </Form.Label>
                                                <AutoCompleteSelect
                                                    lists={filteredProducts}
                                                    selectedKey={selectedProducto}
                                                    onClick={(selectedKey) => {
                                                        setSelectedProducto(selectedKey.key);
                                                    }}
                                                    addNewButton={false}
                                                    onInputChange={() => { setSelectedProducto(); }}
                                                    defaultValue={selectedPedido.id_producto.id_producto}
                                                    showLabel={true}
                                                    label={`Si quiere aportar un producto que no es el pedido, ${selectedPedido.id_usuario.nombre} ${selectedPedido.id_usuario.apellido} tendrá que confirmar si lo desea.`}
                                                />
                                            </div>
                                        )}
                                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                            Ingrese la cantidad que quiere aportar (*)
                                        </Form.Label>
                                        <Form.Control
                                            name="cantidad"
                                            type="number"
                                            placeholder="Ingrese la cantidad"
                                            value={cantidad}
                                            onChange={handleChange}
                                            onKeyDown={(event) => {
                                                if (
                                                    !/[0-9.]/.test(event.key) &&
                                                    !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)
                                                ) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                        {selectedObra && (
                                            <Form.Label className="font-rubik" style={{ marginTop: '1rem', fontSize: '1rem' }}>
                                                Usted esta aportando desde la obra <strong>{selectedObra.nombre}</strong>
                                            </Form.Label>
                                        )}
                                        {obrasDisponibles && obrasDisponibles.length > 1 && (
                                            <>
                                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                                    Ingrese la obra que realiza el aporte (*)
                                                </Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="obra"
                                                    onChange={(event) => {
                                                        setSelectedObra(obrasDisponibles.find(obra => obra.id_obra === Number(event.target.value)));
                                                    }}
                                                >
                                                    {obrasDisponibles.map(obra => (
                                                        selectedPedido.id_obra && selectedPedido.id_obra.id_obra !== obra.id_obra && (
                                                            <option key={obra.id_obra} value={obra.id_obra}>
                                                                {obra.nombre}
                                                            </option>
                                                        )
                                                    ))}
                                                </Form.Control>
                                            </>
                                        )}
                                        {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom:"0px" }}>{error}</p>}
                                    </Form.Group>
                                )}
                            </>
                        )}
                    </div>
                }
            />
        </div>
    );

}

export default PedidoListing;