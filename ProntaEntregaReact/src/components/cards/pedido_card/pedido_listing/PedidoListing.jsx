import React, { useState, useEffect, useRef } from 'react';
import Loading from '../../../loading/loading.jsx';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import GenericCard from '../../../cards/generic_card/GenericCard.jsx';
import deleteData from '../../../../functions/deleteData.jsx';
import Modal from '../../../modals/Modal.jsx';
import GenericAccordion from '../../../accordions/generic_accordion/GenericAccordion.jsx';
import postData from '../../../../functions/postData.jsx';
import Semaforo from '../../../semaforo/Semaforo.jsx';

function PedidoListing({ sortedPedidos, obraSelected, obrasDisponibles, user }) {
    const token = Cookies.get('token');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');
    const pedidoCardRef = useRef(null);

    const [selectedPedido, setSelectedPedido] = useState(null);
    const [selectedObra, setSelectedObra] = useState(obraSelected);
    const [isLoading, setIsLoading] = useState(true);
    const [showTakePedidoModal, setShowTakePedidoModal] = useState(false);

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

    const handleChange = (event) => {
        setCantidad(event.target.value);
        if (event.target.value === '') {
            setError('La cantidad no puede estar vacía');
        } else {
            setError('');
        }
    };

    const deletePedido = (pedidoId) => {
        deleteData(`delete_detalle_pedido/${pedidoId}/`, token).then(() => {
            setPedidos((prevPedidos) => prevPedidos.filter(pedido => pedido.id_pedido !== pedidoId));
            window.location.reload();
        }).catch(error => {
            console.error('Error deleting pedido:', error);
        });
    };

    const createAportePedido = async (pedidoId, usuarioId, fecha, cantidad) => {
        const pedido = sortedPedidos.flatMap(obra => obra.pedidos).find(pedido => pedido.id_pedido === pedidoId);
        const cantidadRestante = pedido.cantidad - pedido.progreso;

        if (parseFloat(cantidad) > parseFloat(cantidadRestante)) {
            setError(`La cantidad ofrecida no puede exceder la cantidad restante de ${cantidadRestante} ${pedido.id_producto.unidadmedida}`);
            return false;
        }

        const data = {
            id_pedido: pedidoId,
            id_usuario: usuarioId,
            id_obra: selectedObra.id_obra,
            fecha: fecha,
            cantidad: parseInt(cantidad, 10)
        };

        try {
            await postData('crear_aporte_pedido/', data, token).then(() => {
                window.location.reload();
                return true;
            });
        } catch (error) {
            console.error('Error creando el aporte del pedido:', error);
            return false;
        }
    };

    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <div className='pedido-list'>
            <h1>Viendo {selectedObra ? `los pedidos hechos a la obra '${selectedObra.nombre}'` : 'todos los pedidos'}</h1>
            <div className='cardCategori'>
                {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                    sortedPedidos.map(obra => (
                        <GenericAccordion titulo={`Pedidos de '${obra.obra.nombre}'`} wide='80%' key={obra.obra.id_obra}
                            children={obra.pedidos.map(pedido => (
                                <div key={pedido.id_pedido} onClick={() => {
                                    setSelectedPedido(pedido);
                                    setShowTakePedidoModal(true);
                                    if (obrasDisponibles && obrasDisponibles.length > 1) {
                                        const filteredObras = obrasDisponibles.filter(obra => pedido.id_obra && pedido.id_obra.id_obra !== obra.id_obra);
                                        if (filteredObras.length > 0) {
                                            setSelectedObra(filteredObras[0]);
                                        }
                                    }
                                }}>
                                    <GenericCard hoverable={true}
                                        foto={pedido.id_producto.imagen}
                                        titulo={pedido.id_producto.nombre}
                                        descrip1={<><strong>Cantidad:</strong> {pedido.progreso} / {pedido.cantidad} {pedido.id_producto.unidadmedida}</>}
                                        descrip2={<><strong>Urgencia:</strong> {pedido.urgente_label} <Semaforo urgencia={pedido.urgente}/></>}
                                        descrip3={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
                                        descrip4={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento}</>}
                                    />
                                </div>
                            ))}
                        />
                    ))
                ) : (
                    <p style={{ marginLeft: '7rem', marginTop: '1rem' }}> No hay pedidos disponibles.</p>
                )}
            </div>
            {selectedPedido && (
                <Modal
                    showButton={false}
                    showModal={showTakePedidoModal}
                    saveButtonText='Tomar'
                    handleCloseModal={() => { setShowTakePedidoModal(false); setSelectedPedido(null); }}
                    title='Tomar Pedido'
                    handleSave={() => createAportePedido(selectedPedido.id_pedido, user.id_usuario, new Date().toISOString().split('T')[0], cantidad, selectedObra)}
                    content={
                        <div>
                            <GenericCard
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
                            <Form.Control
                                type='number'
                                placeholder='Ingrese la cantidad que quiere tomar'
                                value={cantidad}
                                onChange={handleChange}
                                style={{ marginTop: '1rem' }}
                            />
                            {obrasDisponibles.length === 1 ? (
                                useEffect(() => {
                                    if (selectedPedido.id_obra.id_obra !== obrasDisponibles[0].id_obra) {
                                        setSelectedObra(obrasDisponibles[0]);
                                    }
                                }, [obrasDisponibles])
                            ) : (
                                <>
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                        Ingrese la obra que realiza el aporte
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="obra"
                                        onChange={(event) => {
                                            setSelectedObra(obrasDisponibles.find(obra => obra.id_obra === Number(event.target.value)));
                                        }}
                                    >
                                        {obrasDisponibles.filter(obra => selectedPedido.id_obra && selectedPedido.id_obra.id_obra !== obra.id_obra).map(obra => (
                                            <option key={obra.id_obra} value={obra.id_obra}>
                                                {obra.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </>
                            )}
                            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                        </div>
                    }
                />
            )}
        </div>
    );
}

export default PedidoListing;