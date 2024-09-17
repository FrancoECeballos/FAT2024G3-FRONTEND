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

function PedidoListing({ sortedPedidos, selectedObra, obrasDisponibles, user }) {
    const token = Cookies.get('token');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');
    const pedidoCardRef = useRef(null);

    const [selectedPedido, setSelectedPedido] = useState({});
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
    }, [sortedPedidos, selectedObra]);

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

    const createAportePedido = (pedidoId, usuarioId, fecha, cantidad) => {
        const data = {
            id_pedido: pedidoId,
            id_usuario: usuarioId,
            fecha: fecha,
            cantidad: parseInt(cantidad, 10)
        };

        postData('crear_aporte_pedido/', data, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error creating aporte pedido:', error);
        });
    };

    if (isLoading) {
        return <div><Loading /></div>;
    }

    const shouldShowButtons = !(obrasDisponibles && obrasDisponibles.length === 1 && selectedPedido.id_obra && selectedPedido.id_obra.id_obra === obrasDisponibles[0].id_obra);

    return (
        <div className='pedido-list'>
            <h1>Viendo {selectedObra ? `los pedidos hechos a la obra '${selectedObra.nombre}'` : 'todos los pedidos'}</h1>
            <div className='cardCategori'>
                {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                    sortedPedidos.map(obra => (
                        <GenericAccordion titulo={`Pedidos de '${obra.obra.nombre}'`} wide='80%' key={obra.obra.id_obra}
                            children={obra.pedidos.map(pedido => (
                                <div key={pedido.id_pedido} onClick={() => setSelectedPedido(pedido)}>
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
            <Modal
                showButton={false}
                showDeleteButton={shouldShowButtons}
                saveButtonShown={shouldShowButtons}
                showModal={Object.keys(selectedPedido).length > 0}
                saveButtonText={'Tomar'}
                handleCloseModal={() => setSelectedPedido({})}
                deleteFunction={() => deletePedido(selectedPedido.id_pedido)}
                deleteButtonText={'Rechazar'}
                title={'Tomar Pedido'}
                handleSave={() => createAportePedido(selectedPedido.id_pedido, user.id_usuario, new Date().toISOString().split('T')[0], cantidad)}
                content={
                    <div>
                        {selectedPedido && selectedPedido.id_producto && (
                            <>
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
                            
                                {shouldShowButtons && (
                                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                            Ingrese la cantidad que quiere aportar
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
                                        {!selectedObra && obrasDisponibles && (
                                            <>
                                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                                    Ingrese la obra que realiza el aporte
                                                </Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="obra"
                                                    onChange={(event) => {
                                                        setSelectedObra(obrasDisponibles.find(obra => obra.id_obra === event.target.value));
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
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
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