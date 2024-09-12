import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import GenericCard from '../../../cards/generic_card/GenericCard.jsx';
import deleteData from '../../../../functions/deleteData.jsx';
import Modal from '../../../modals/Modal.jsx';
import GenericAccordion from '../../../accordions/generic_accordion/GenericAccordion.jsx';
import postData from '../../../../functions/postData.jsx';

function PedidoListing({ sortedPedidos }) {
    const token = Cookies.get('token');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');
    const pedidoCardRef = useRef(null);

    const [selectedPedido, setSelectedPedido] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            if (pedidoCardRef.current) {
                setIsFormValid(pedidoCardRef.current.isFormValid);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [pedidoCardRef]);


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

    return (
        <div className='pedido-list'>
            <div className='cardCategori'>
                {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                    sortedPedidos.map(obra => (
                        <GenericAccordion titulo={obra.obra.nombre} wide='80%' key={obra.obra.id_obra}
                            children={obra.pedidos.map(pedido => (
                                <div key={pedido.id_pedido} onClick={() => setSelectedPedido(pedido)}>
                                    <GenericCard hoverable={true}
                                        foto={pedido.id_producto.imagen}
                                        titulo={pedido.id_producto.nombre}
                                        descrip1={<><strong>Cantidad:</strong> {pedido.progreso} / {pedido.cantidad} {pedido.id_producto.unidadmedida}</>}
                                        descrip2={<><strong>Urgencia:</strong> {pedido.urgente}</>}
                                        descrip3={<><strong>Obra:</strong> {pedido.id_obra.nombre} <strong>Usuario:</strong> {pedido.id_usuario.nombre} {pedido.id_usuario.apellido}</>}
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
                showDeleteButton={true}
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
                            <GenericCard
                                key={selectedPedido.id_pedido}
                                foto={selectedPedido.id_producto.imagen}
                                titulo={selectedPedido.id_producto.nombre}
                                descrip1={<><strong>Cantidad:</strong> {selectedPedido.progreso} / {selectedPedido.cantidad} {selectedPedido.id_producto.unidadmedida}</>}
                                descrip2={<><strong>Urgencia:</strong> {selectedPedido.urgente}</>}
                                descrip3={<><strong>Fecha Inicio:</strong> {selectedPedido.fechainicio}</>}
                                descrip4={<><strong>Fecha Vencimiento:</strong> {selectedPedido.fechavencimiento}</>}
                                descrip5={<><strong>Obra:</strong> {selectedPedido.id_obra.nombre}</>}
                                descrip6={<><strong>Usuario:</strong> {selectedPedido.id_usuario.nombre} {selectedPedido.id_usuario.apellido}</>}
                            />
                        )}
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
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Form.Group>
                    </div>
                }
            />
        </div>
    );

}

export default PedidoListing;
