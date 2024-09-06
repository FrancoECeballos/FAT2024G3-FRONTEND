import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import deleteData from '../../functions/deleteData.jsx';
import Modal from '../../components/modals/Modal.jsx';
import PedidoCard from '../../components/cards/pedido_card/PedidoCard.jsx';
import GenericAccordion from '../../components/accordions/generic_accordion/GenericAccordion.jsx';
import postData from '../../functions/postData.jsx';
import Loading from '../../components/loading/loading.jsx';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');
    const pedidoCardRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser(navigate);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData().then(() => {
            fetchData(`/userToken/${token}`, token).then((result) => {
                if (result.is_superuser) {
                    fetchData(`get_pedido_for_admin/`, token).then((result) => {
                        setPedidos(result);
                        setIsLoading(false);
                    }).catch(error => {
                        console.error('Error fetching pedidos:', error);
                        setIsLoading(false);
                    });
                } else {
                    fetchData(`get_pedido_by_user/${token}/`, token).then((result) => {
                        setPedidos(result);
                        setIsLoading(false);
                    }).catch(error => {
                        console.error('Error fetching pedidos:', error);
                        setIsLoading(false);
                    });
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });
        });
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pedidoCardRef.current) {
                setIsFormValid(pedidoCardRef.current.isFormValid);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [pedidoCardRef]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleChange = (event) => {
        setCantidad(event.target.value);
        if (event.target.value === '') {
            setError('La cantidad no puede estar vacía');
        } else {
            setError('');
        }
    };

    const handleCreatePedido = () => {
        if (pedidoCardRef.current) {
            const pedidoForm = pedidoCardRef.current.getPedidoForm();
            const { obras, ...pedidoFormWithoutObras } = pedidoForm;
            console.log('Pedido form:', pedidoForm);    

            postData('crear_pedido/', pedidoFormWithoutObras, token).then((result) => {
                console.log('Pedido creado:', result);
                const obrasPromises = obras.map((obra) =>
                    postData('crear_detalle_pedido/', { id_stock: obra, id_pedido: result.id_pedido }, token)
                );
                return Promise.all(obrasPromises).then(() => result);
            }).then((result) => {
                console.log('Detalles de pedido creados:', result);

                const productoNombre = result.id_producto.name || 'Nombre no disponible';
                const productoUnidad = result.id_producto.unidadmedida || 'Unidad no disponible';
                const cantidad = result.cantidad || 'Cantidad no disponible';

                const tituloNotificacion = ` "Notificacion Creada" - ${user.nombre} ${user.apellido}`;
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const dataNotificacion = {
                    titulo: tituloNotificacion,
                    descripcion: 'Nuevo pedido creado',
                    id_usuario: user.id_usuario,
                    fecha_creacion: fechaCreacion
                };
                console.log('Datos de la notificación:', dataNotificacion);
                return postData('PostNotificacion/', dataNotificacion, token).then(() => {
                    window.location.reload();
                });
            }).then((notificacionResult) => {
                console.log('Notificación creada:', notificacionResult);
            }).catch((error) => {
                console.error('Error al crear el pedido, los detalles del pedido o la notificación:', error);
            });
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
            cantidad: cantidad
        };

        postData('crear_aporte_pedido/', data, token).then(() => {
            console.log('Aporte del pedido creado');
        }).catch(error => {
            console.error('Error creating aporte pedido:', error);
        });
    };

    const filters = [
        { type: 'obra.nombre', label: 'Nombre de la Obra' },
        { type: 'obra.pedido.fechainicio', label: 'Fecha Inicio' },
        { type: 'obra.pedido.fechavencimiento', label: 'Fecha Vencimiento' },
        { type: 'obra.pedido.id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'obra.pedido.id_obra.nombre', label: 'Nombre de la Obra Pidiendo' },
        { type: 'obra.pedido.id_usuario.nombre', label: 'Nombre del Usuario' }
    ];

    const filteredPedidos = pedidos.map(obra => {
        const filteredPedidosInObra = obra.pedidos.filter(pedido => {
            return (
                pedido?.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_producto?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_obra?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_usuario?.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        return { ...obra, pedidos: filteredPedidosInObra };
    }).filter(obra => obra.pedidos.length > 0);

    const sortedPedidos = filteredPedidos.map(obra => {
        const sortedPedidosInObra = [...obra.pedidos].sort((a, b) => {
            if (!orderCriteria) return 0;
            const getValue = (obj, path) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };
    
            const aValue = getValue(a, orderCriteria.replace('obra.pedido.', ''));
            const bValue = getValue(b, orderCriteria.replace('obra.pedido.', ''));
    
            if (orderCriteria.includes('fechainicio') || orderCriteria.includes('fechavencimiento')) {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return aDate - bDate;
            }
    
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
            }
    
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return bValue - aValue;
            }
    
            return 0;
        });
    
        return { ...obra, pedidos: sortedPedidosInObra };
    });

    if (isLoading) {
        return <div> <FullNavbar selectedPage='Pedidos' /><Loading /></div>;
    }

    return (
        <div>
            <FullNavbar selectedPage='Pedidos' />
            <div className='margen-arriba'>
                <h2 style={{ marginLeft: '7rem' }}>Pedidos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='pedido-list'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                        <Modal
                            tamaño={'lg'}
                            openButtonText='¿No encuentra su pedido? Añadalo'
                            openButtonWidth='20'
                            title='Nuevo Pedido'
                            saveButtonText='Crear'
                            handleCloseModal={() => setCantidad('')}
                            handleSave={handleCreatePedido}
                            showModal={false}
                            showButton={true}
                            saveButtonEnabled={isFormValid}
                            content={
                                <PedidoCard user={user} stocksDisponibles={pedidos} ref={pedidoCardRef} />
                            }
                        />
                    </div>
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
                                                descrip3={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento}</>}
                                                descrip4={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
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
                        deleteFunction={() => deletePedido(selectedPedido)}
                        deleteButtonText={'Rechazar'}
                        title={'Tomar Pedido'}
                        handleSave={() => createAportePedido(selectedPedido, user.id_usuario, new Date().toISOString().split('T')[0], cantidad)}
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
            </div>
        </div>
    );
}

export default Pedidos;
